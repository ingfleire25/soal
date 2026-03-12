# Proyecto de Solicitudes de Transporte Acuático

Este repositorio contiene una **API sencilla** construida con Node.js, Express y Sequelize que almacena solicitudes en una base de datos PostgreSQL, junto con un **frontend minimalista** en Vue 3 para crear nuevas solicitudes y visualizar un tablero con todas ellas.

## Estructura

- `server` – backend Express/Sequelize.
- `cliente/` – aplicación Vue 3 con Vite.

## Backend
 Crea un archivo .env con las siguientes variables de entorno:
#Entorno de ejecicion local
PORT=3001
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_NAME=soaldb
DB_PORT=5432

crea una base de datos en postgres con el mismo nombre que DB_NAME.

1. Copiar `.env.example` a `.env` y configurar la conexión a la base de datos.
2. Instalar dependencias y ejecutar:
   ```bash
   cd server
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
   cd cliente
   npm install
   npm run dev   # abre en http://localhost:5173 por defecto
   ```
2. La aplicación ofrece dos vistas:
   - formulario para crear una solicitud.
   - tabla que muestra todas las solicitudes guardadas.

No se requiere autenticación ni lógica adicional; la API y el cliente hablan directamente.

