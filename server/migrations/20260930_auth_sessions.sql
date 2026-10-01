-- La migración es atómica: si una instrucción falla, PostgreSQL puede revertir todo el cambio.
BEGIN;

-- Añade el contador a los usuarios existentes con valor inicial cero.
-- La aplicación suma fallos de clave o de inicio duplicado; al tercero desactiva al usuario y reinicia el contador.
ALTER TABLE "usuario"
  ADD COLUMN IF NOT EXISTS "intentosFallidos" INTEGER NOT NULL DEFAULT 0;

-- Guarda una fila por sesión iniciada. ended_at NULL significa que todavía no se ha cerrado.
CREATE TABLE IF NOT EXISTS "usuario_sesion" (
  "id" BIGSERIAL PRIMARY KEY,
  -- Si se elimina el usuario, también se eliminan sus sesiones.
  "usuario_id" INTEGER NOT NULL REFERENCES "usuario"("id") ON DELETE CASCADE,
  -- Se guarda el hash del token, no el token que permitiría autenticarse.
  "token_hash" VARCHAR(64) NOT NULL UNIQUE,
  -- Datos de origen para identificar desde qué equipo se inició la sesión.
  "ip_address" VARCHAR(64),
  "user_agent" TEXT,
  -- Fechas de inicio, última actividad, vencimiento por inactividad y cierre.
  "started_at" TIMESTAMPTZ NOT NULL,
  "last_activity_at" TIMESTAMPTZ NOT NULL,
  "expires_at" TIMESTAMPTZ NOT NULL,
  "ended_at" TIMESTAMPTZ,
  -- Motivo de cierre: logout, expiración por inactividad o bloqueo de cuenta.
  "end_reason" VARCHAR(40)
);

-- Impide más de una sesión abierta por usuario; permite conservar el historial de sesiones cerradas.
CREATE UNIQUE INDEX IF NOT EXISTS "usuario_sesion_unica_activa_idx"
  ON "usuario_sesion" ("usuario_id")
  WHERE "ended_at" IS NULL;

-- Acelera la búsqueda de sesiones abiertas cuyo plazo de inactividad ya venció.
CREATE INDEX IF NOT EXISTS "usuario_sesion_expiracion_idx"
  ON "usuario_sesion" ("expires_at")
  WHERE "ended_at" IS NULL;

-- Registra inicios, cierres, bloqueos e interacciones. No almacena contraseñas ni cuerpos de petición.
CREATE TABLE IF NOT EXISTS "usuario_sesion_evento" (
  "id" BIGSERIAL PRIMARY KEY,
  -- Se conserva el evento aunque se elimine el usuario o la sesión asociada.
  "usuario_id" INTEGER REFERENCES "usuario"("id") ON DELETE SET NULL,
  "sesion_id" BIGINT REFERENCES "usuario_sesion"("id") ON DELETE SET NULL,
  "tipo" VARCHAR(40) NOT NULL,
  -- Método y ruta permiten conocer la acción realizada sin guardar datos enviados.
  "metodo" VARCHAR(10),
  "ruta" TEXT,
  "ip_address" VARCHAR(64),
  "user_agent" TEXT,
  -- Fecha y hora exactas en que ocurrió el evento.
  "ocurrido_en" TIMESTAMPTZ NOT NULL
);

-- Facilita consultar cronológicamente todos los eventos de una sesión.
CREATE INDEX IF NOT EXISTS "usuario_sesion_evento_sesion_idx"
  ON "usuario_sesion_evento" ("sesion_id", "ocurrido_en");

-- Confirma la transacción si todas las instrucciones anteriores finalizaron correctamente.
COMMIT;