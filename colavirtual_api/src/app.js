const express = require( 'express' )
const cookieParser = require( 'cookie-parser' )
const morgan = require( 'morgan' )
const routes = require( './routes' )
require( './db.js' )
const server = express()
const cors = require( 'cors' )
// const { logger } = require( './middleware/logEventos' )
const errorHandler = require( './middleware/logError' )
const opcionesCors = require( './config/cors.config' )
const credenciales = require( './middleware/credenciales' )


server.name = 'COLAVIRTUAL-API'
// server.use( logger )
server.use( credenciales ) // para corregir problemas con fetch
server.use( cors( opcionesCors ) )
server.use( express.urlencoded( { extended: true, limit: '50mb' } ) )
server.use( express.json( { limit: '50mb' } ) )
server.use( cookieParser() )
server.use( morgan( 'dev' ) )
server.use( '/', routes )

server.all( '*', ( req, res ) => res.status( 404 ).json( { statusCode: 404, statusText: "No se encontró el recurso" } ) )
server.use( errorHandler )

// Error catching endware.
// server.use( ( err, req, res, next ) => { // eslint-disable-line no-unused-vars
//     const status = err.status || 500
//     const message = err.message || err
//     console.error( err )
//     res.status( status ).send( message )
// } );

module.exports = server
