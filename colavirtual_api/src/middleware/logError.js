const { logEventos } = require( './logEventos' );

const errorHandler = ( err, req, res, next ) => {
    logEventos( `${err.name}: ${err.message}`, 'errorLog.txt' );
    console.error( err.stack )
    res.status( 500 ).send( err.message );
}

module.exports = errorHandler;