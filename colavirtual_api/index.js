const server = require( './src/app.js' );
require( 'dotenv' ).config();
const PUERTO = process.env.PORT || 3001;


server.listen( PUERTO, () => {
    console.log( `Servidor ejecutándose en el puerto ${PUERTO}` ); // eslint-disable-line no-console
} );