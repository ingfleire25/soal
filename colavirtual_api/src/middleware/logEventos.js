const { format } = require( 'date-fns' );
const { v4: uuid } = require( 'uuid' );

const fs = require( 'fs' );
const fsPromises = require( 'fs' ).promises;
const path = require( 'path' );

const logEventos = async ( mensaje, logNombre ) => {
    const fechaHora = `${format( new Date(), 'yyyyMMdd\tHH:mm:ss' )}`;
    const logItem = `${fechaHora}\t${uuid()}\t${mensaje}\n`;

    try {
        if ( !fs.existsSync( path.join( __dirname, '..', 'logs' ) ) ) { // si la carpeta logs no existe
            await fsPromises.mkdir( path.join( __dirname, '..', 'logs' ) ); // crearla
        }
        await fsPromises.appendFile( path.join( __dirname, '..', 'logs', logNombre ), logItem ); // escribir en logNombre: archivo
    } catch ( err ) {
        console.log( err );
    }
}

const logger = ( req, res, next ) => {
    logEventos( `${req.method}\t${req.headers.origin}\t${req.url}`, 'peticionesLog.txt' );
    console.log( `${req.method} ${req.path}` );
    next();
}

module.exports = { logger, logEventos };