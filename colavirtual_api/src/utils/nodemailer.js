const sendEmail = require( '../config/nodemailer.config' )

const getTemplate = ( template, body ) => {
    const templates = {
        bienvenida: getBienvenida,
        banned: getBanned,
        unbanned: getUnBanned,
        compraDespachada: getDespachada,
        purchaseReceipt: getPurchaseReceipt,
        userEliminado: getUserEliminado,
        userRestaurado: getUserRestaurado
    }
    return templates[ template ]( body )
}

const getBienvenida = ( name ) => {
    return `
        

                    <html>
                <head>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
                </head>
            
                <body style="font-family: Monserrat;">

                    <div class="card" style="border: 2px solid #bbb;width: 80%;border-radius: .25rem;margin: 0 auto;max-width: 600px;box-shadow: 0 5px 11px 0 rgba(0, 0, 0, .18), 0 4px 15px 0 rgba(0, 0, 0, .15);">
                        <div class="container" style="background-color:#f1f1f1; padding: 2px 16px">
                        <img src='https://i.ibb.co/6Y4Tcd8/pdvsa-logo.png' alt='Logo PDVSA' width=300px>
                            <h1 class="empresa" style="color: #A50000; text-align: center;">SISCAI</h3>
                        </div>
                        
                        <div class="container" style="background-color:#f1f1f1; padding: 2px 16px">
                            <h2 class="titulo" style="color: #253E6F;"><b>Nueva Solicitud Registrada</b></h2>
                            <p>Hola <strong>${name}</strong>,</p>
                            <p>Se ha registrado una nueva solicitud con los siguientes detalles:</p>
                            
                            <ul class="list-group" style="display: flex;-ms-flex-direction: column;flex-direction: column;">
                                <li class="list-items">
                                    <i class="fas fa-check"></i>
                                    Tipo de Solicitud: <strong></strong>
                                </li>
                                <li class="list-items" style="">
                                    <i class="fas fa-check"></i>
                                    Localidad: <strong></strong>
                                </li>
                                <li class="list-items" style="">
                                    <i class="fas fa-check"></i>
                                    Fecha: <strong></strong>
                                </li>
                                <li class="list-items" style="">
                                    <i class="fas fa-check"></i>
                                    Numero de solicitud: <strong></strong>
                                </li>
                            </ul>
                        </div>
                        <div class="container" style="background-color:#f1f1f1; padding: 2px 16px">
                            <p>Gracias por usar nuestro servicio</p>
                            <p class="expire" style="color:#A50000;">Atentamente, <br>Recursos Humanos</p>
                        </div>
                    </div>

                </body>
            </html>

            
        <!-- <p>Ahora que estás regitrado/a, te contamos lo que puedes hacer:</p>
        <ul>
            <li>Buscar los libros que quieras.</li>
            <li>Agregarlos a tus favoritos.</li>
            <li>Dejarlos en tu carrito para luego comprarlos.</li>
            <li>¡Pagar todo con tu cuenta MercadoPago!</li>
        </ul>
        <p>Librería Henry. Tu librería de confianza.</p>
        <h3 style="margin: auto;">¡Realiza tu primera compra! 👉<a
        href="http://henry-library.netlify.app/" target="_blank"
        style="text-decoration: none;">LH</a></h3> -->
        `;
}
const getPurchaseReceipt = ( body ) => {
    const { user, association } = body
    const books = association.books
    const rows = books.reduce( ( prev, curr, idx ) => {
        return prev + `
        <tr style="height: 40px;">
            <td style="margin: 15px; text-align: center; ">${books[ idx ].title}</td>
            <td style="text-align: center;">${books[ idx ].payment_mp_book.quantity}</td>
            <td style="text-align: center;">$${( parseFloat( books[ idx ].price ) * parseFloat( books[ idx ].payment_mp_book.quantity ) ).toFixed( 2 )
            }</td>
        </tr>
        `
    }, "" )
    const html = `
    <h2 style="text-align: center;">${user.nameUser || 'Usuario'} ¡Gracias tu compra!</h2>
    <h2 style="text-align: center;">A continuación, adjuntamos su recibo (${association.transactionId})</h2>
    <table style=" table-layout: fixed; width:80%; border-collapse: collapse; border: 3px solid #01A86C;
        margin: auto; margin-top: 50px; margin-bottom: 50px;">
        <tr style="height: 30px;">
            <th style="border-bottom: 2px solid #01A86C;">Libro</th>
            <th style="border-bottom: 2px solid #01A86C;">Cantidad</th>
            <th style="border-bottom: 2px solid #01A86C;">Precio</th>
        </tr>
        ${rows}
        <!-- aquí va el subtotal -->
        <!-- <tr style="height: 40px;">
            <td style="margin: 15px; text-align: center; "> Gastos de Envío </td>
            <td style="text-align: center;"> N/A </td>
            <td style="text-align: center;">$ total del envío </td>
        </tr> -->
        <!-- aquí termina el subtotal -->
        <tr style="text-align: center; height: 40px;">
            <td style="text-align: center; font-size: 30px;">Total</td>
            <td></td>
            <td style="font-size: 30px;">$${association.total}</td>
        </tr>
    </table>
    <div style="display:flex; justify-content: center; flex-direction:
        column;padding: 10px; background-color: rgba(7, 148, 7, 0.711);">
        <h3 style="margin: auto;">Vuelve a visitarnos 👉<a
                href="http://henry-library.netlify.app/" target="_blank"
                style="text-decoration: none;">LH</a></h3>
        <br>
        <h2 style="margin: auto;">Librería Henry. Tu librería de confianza.</h2>
    </div>    
    `
    return html
}
const getBanned = ( name ) => {
    return `
    <img src='https://i.ibb.co/MN512MH/logo-Hen-Ry-Library.jpg' alt='HenryLibraryLogo'>
    <h2>Estimado/a ${name}, has sido baneado/a.
        <br>
        Para mayor información, escríbenos a <a href="mailito:henrylibrary@gmail.com">henrylibrary@gmail.com</a>
    </h2>
    <p>
        <strong>
        Atte. <a
        href="http://henry-library.netlify.app/" target="_blank"
        style="text-decoration: none;">Librería Henry</a>
        </strong>
    </p>
    `
}
const getUnBanned = ( name ) => {
    return `
    <img src='https://i.ibb.co/MN512MH/logo-Hen-Ry-Library.jpg' alt='HenryLibraryLogo'>
    <h2>Estimado/a ${name}, es un agrado comunicarte que has vuelto, favorablemente, con nosotros.<br> ¡Qué gusto tenerte de regreso!</h2>
    <p>Atte. <a
        href="http://henry-library.netlify.app/" target="_blank"
        style="text-decoration: none;">Libreria Henry</a>
    </p>
    `
}
const getDespachada = ( body ) => {
    const { user, transactionId, deliveryAddress } = body
    return `
    <img src='https://i.ibb.co/MN512MH/logo-Hen-Ry-Library.jpg' alt='HenryLibraryLogo'>
    <p>Estimado/a <strong>${user.nameUser}</strong>, te informamos que tu compra (<strong>${transactionId}</strong>) ha sido despachada a la dirección <strong>${deliveryAddress}</strong> confirmada durante la compra.</p>
    <p>Atte. <a
        href="http://henry-library.netlify.app/" target="_blank"
        style="text-decoration: none;">Libreria Henry</a>
    </p>
    `
}
const getUserEliminado = ( name ) => {
    return `
    <img src='https://i.ibb.co/MN512MH/logo-Hen-Ry-Library.jpg' alt='HenryLibraryLogo'>
    <h2>Estimado/a ${name}, tu cuenta ha sido eliminada satisfactoriamente.
        <br>
        Si esta solicitud no la hiciste tú, escríbenos a <a href="mailito:henrylibrary@gmail.com">henrylibrary@gmail.com</a>
    </h2>
    <p>
        <strong>
        Atte. <a
        href="http://henry-library.netlify.app/" target="_blank"
        style="text-decoration: none;">Librería Henry</a>
        </strong>
    </p>
    `
}
const getUserRestaurado = ( name ) => {
    return `
    <img src='https://i.ibb.co/MN512MH/logo-Hen-Ry-Library.jpg' alt='HenryLibraryLogo'>
    <h2>Estimado/a ${name}, es un agrado comunicarte que tu cuenta ha sido restaurada.<br> ¡Qué gusto tenerte de regreso!</h2>
    <p>Atte. <a
        href="http://henry-library.netlify.app/" target="_blank"
        style="text-decoration: none;">Libreria Henry</a>
    </p>
    `
}

module.exports = {
    sendEmail,
    getTemplate
}