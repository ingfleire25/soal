# Migracion de nombres de tablas PostgreSQL

Esta migracion aplica la nomenclatura de tablas de `normaBD.txt` solamente a los modelos PostgreSQL. Renombra las tablas existentes sin recrearlas, por lo que conserva sus filas, columnas, indices y restricciones. Oracle no se modifica.

| Nombre actual | Nombre normalizado | Clasificacion |
| --- | --- | --- |
| `evaluacionTransporte` | `C001T_EVALUACION_TRANSP` | Transaccional |
| `materiales` | `C002T_MATERIAL` | Transaccional (detalle de suministro) |
| `solicitud` | `C003T_SOLICITUD` | Transaccional |
| `suministroLacustre` | `C004T_SUMINISTRO_LACUSTRE` | Transaccional |
| `usuario` | `J001T_USUARIO` | Base |
| `usuario_sesion` | `C005T_USUARIO_SESION` | Transaccional |
| `usuario_sesion_evento` | `C006T_USUARIO_SESION_EVENTO` | Transaccional |

Los prefijos `C` y `J` clasifican tablas transaccionales y base, respectivamente. Los consecutivos son identificadores asignados para este esquema. Los nombres respetan el formato `AnnnT_Nombre_Tabla` y el maximo de 30 caracteres.

## Pasos para aplicar en PostgreSQL local

1. Deten la API y cualquier proceso que escriba en la base de datos.
2. Desde PowerShell, crea un respaldo previo (ajusta host, puerto, usuario y base si no usas los valores locales habituales):

   ```powershell
   pg_dump -h localhost -p 5432 -U postgres -d soaldb -Fc -f .\soaldb-antes-de-renombrar.dump
   ```

3. Desde el directorio `server`, aplica el script con `psql`. PostgreSQL solicitara la contrasena si hace falta:

   ```powershell
   psql -h localhost -p 5432 -U postgres -d soaldb -v ON_ERROR_STOP=1 -f .\migrations\20261026_postgres_nombres_normalizados.sql
   ```

   Tambien puedes abrir `migrations/20261026_postgres_nombres_normalizados.sql` en pgAdmin, seleccionar la base `soaldb` y ejecutar el script completo.

4. Comprueba los nombres en `psql`:

   ```sql
   SELECT tablename
   FROM pg_tables
   WHERE schemaname = 'public'
     AND tablename IN (
       'C001T_EVALUACION_TRANSP',
       'C002T_MATERIAL',
       'C003T_SOLICITUD',
       'C004T_SUMINISTRO_LACUSTRE',
       'J001T_USUARIO',
       'C005T_USUARIO_SESION',
       'C006T_USUARIO_SESION_EVENTO'
     )
   ORDER BY tablename;
   ```

   Deben aparecer las siete tablas. Comprueba tambien que la consulta equivalente por los nombres anteriores no devuelve filas.
5. Inicia la version actualizada de la API y valida inicio de sesion, consultas/creacion de solicitudes, materiales, evaluaciones y el registro de sesiones.

El script debe ejecutarse una sola vez en una base con el esquema anterior. Si falta alguna tabla o ya existe una tabla destino, PostgreSQL abortara y revertira el bloque completo; resuelve la diferencia de esquema antes de reintentar. Aplica la migracion antes de iniciar la API actualizada: el arranque sincroniza modelos con `alter: true`, lo cual no traslada filas desde las tablas antiguas si no se han renombrado. No ejecutes seeds con `sync({ alter: true })` como sustituto de esta migracion.
