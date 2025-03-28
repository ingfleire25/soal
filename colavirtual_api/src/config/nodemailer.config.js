 const nodemailer = require( 'nodemailer' );
require( 'dotenv' ).config();
const { EMAIL, PASS } = process.env;


const mail = {
    user: EMAIL,
    pass: PASS
}

let transporter = nodemailer.createTransport( {
    // host: 'smtp.gmail.com', // probar si funciona en pdvsa (no funciona)
    //host: '162.122.200.30',
    host: '10.173.11.100',
    // port: 2525, // defaults to 465 if secure is true
    port: 25,
    tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1', // versiones superiores rompen al intentar enviar
    },
    secure: false, // true for 465, false for other ports (gmail requires 465)
    auth: {
        user: mail.user,
        pass: mail.pass
    },
    // proxy: 'http://proxy-host:1234'
} );

const sendEmail = async ( email, subject, html ) => {
    try {
        await transporter.sendMail( {
            from: `Gerencia RRHH <${mail.user}>`, // sender address
            to: email, // list of receivers
            subject, // Subject line
            html, // html body
        } );

    } catch ( error ) {
        console.log( 'Problemas al enviar correo: ', error );
        throw error
    }
}


module.exports = sendEmail
