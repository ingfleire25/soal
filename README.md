# Proyecto de Solicitudes de Transporte Acuático

Este repositorio contiene una **API sencilla** construida con Node.js, Express y Sequelize que almacena solicitudes en una base de datos PostgreSQL, junto con un **frontend minimalista** en Vue 3 para crear nuevas solicitudes y visualizar un tablero con todas ellas.

## Estructura

- `colavirtual_api/` – backend Express/Sequelize.
- `frontend/` – aplicación Vue 3 con Vite.

## Backend

1. Copiar `.env.example` a `.env` y configurar la conexión a la base de datos.
2. Instalar dependencias y ejecutar:
   ```bash
   cd colavirtual_api
   npm install
   npm run dev   # inicia en localhost:3001
   ```

Endpoints disponibles:

- `GET /api/solicitudes` – devuelve todas las solicitudes.
- `POST /api/solicitudes` – crea una nueva solicitud con el cuerpo JSON:
  ```json
  {
    "nombre": "Juan",
    "correo": "juan@ejemplo.com",
    "origen": "A",
    "destino": "B",
    "fechaViaje": "2026-03-05",
    "comentario": "opcional"
  }
  ```

## Frontend

1. Instalar dependencias y ejecutar:
   ```bash
   cd frontend
   npm install
   npm run dev   # abre en http://localhost:5173 por defecto
   ```
2. La aplicación ofrece dos vistas:
   - formulario para crear una solicitud.
   - tabla que muestra todas las solicitudes guardadas.

No se requiere autenticación ni lógica adicional; la API y el cliente hablan directamente.

---

Este repositorio fue adaptado a partir de un proyecto anterior para servir como ejemplo básico de API+front reutilizando estructuras existentes.
