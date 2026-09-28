BEGIN;

ALTER TABLE "solicitud"
  ALTER COLUMN "lunes" DROP DEFAULT,
  ALTER COLUMN "martes" DROP DEFAULT,
  ALTER COLUMN "miercoles" DROP DEFAULT,
  ALTER COLUMN "jueves" DROP DEFAULT,
  ALTER COLUMN "viernes" DROP DEFAULT,
  ALTER COLUMN "sabado" DROP DEFAULT,
  ALTER COLUMN "domingo" DROP DEFAULT;

ALTER TABLE "solicitud"
  ALTER COLUMN "lunes" TYPE VARCHAR(1) USING CASE WHEN "lunes" IS NULL THEN NULL WHEN "lunes" THEN 'C' ELSE 'F' END,
  ALTER COLUMN "martes" TYPE VARCHAR(1) USING CASE WHEN "martes" IS NULL THEN NULL WHEN "martes" THEN 'C' ELSE 'F' END,
  ALTER COLUMN "miercoles" TYPE VARCHAR(1) USING CASE WHEN "miercoles" IS NULL THEN NULL WHEN "miercoles" THEN 'C' ELSE 'F' END,
  ALTER COLUMN "jueves" TYPE VARCHAR(1) USING CASE WHEN "jueves" IS NULL THEN NULL WHEN "jueves" THEN 'C' ELSE 'F' END,
  ALTER COLUMN "viernes" TYPE VARCHAR(1) USING CASE WHEN "viernes" IS NULL THEN NULL WHEN "viernes" THEN 'C' ELSE 'F' END,
  ALTER COLUMN "sabado" TYPE VARCHAR(1) USING CASE WHEN "sabado" IS NULL THEN NULL WHEN "sabado" THEN 'C' ELSE 'F' END,
  ALTER COLUMN "domingo" TYPE VARCHAR(1) USING CASE WHEN "domingo" IS NULL THEN NULL WHEN "domingo" THEN 'C' ELSE 'F' END;

ALTER TABLE "solicitud"
  ADD CONSTRAINT "solicitud_lunes_dia_chk" CHECK ("lunes" IS NULL OR "lunes" IN ('C', 'F')),
  ADD CONSTRAINT "solicitud_martes_dia_chk" CHECK ("martes" IS NULL OR "martes" IN ('C', 'F')),
  ADD CONSTRAINT "solicitud_miercoles_dia_chk" CHECK ("miercoles" IS NULL OR "miercoles" IN ('C', 'F')),
  ADD CONSTRAINT "solicitud_jueves_dia_chk" CHECK ("jueves" IS NULL OR "jueves" IN ('C', 'F')),
  ADD CONSTRAINT "solicitud_viernes_dia_chk" CHECK ("viernes" IS NULL OR "viernes" IN ('C', 'F')),
  ADD CONSTRAINT "solicitud_sabado_dia_chk" CHECK ("sabado" IS NULL OR "sabado" IN ('C', 'F')),
  ADD CONSTRAINT "solicitud_domingo_dia_chk" CHECK ("domingo" IS NULL OR "domingo" IN ('C', 'F'));

COMMIT;
