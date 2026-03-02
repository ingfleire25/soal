import { validarAlpha, validarCorreo } from '../utils/validaciones'


export const validarFormato = ( input ) => {
    let errores = {}
    if ( input.nombre ) {
        if ( !validarAlpha( true, input.nombre ) ) { // tildes?, valor
            errores.nombre = 'Formato inválido'
        }
    }
    if ( input.apellido ) {
        if ( !validarAlpha( true, input.apellido ) ) { // tildes?, valor
            errores.apellido = 'Formato inválido'
        }
    }
    if ( input.correo ) {
        if ( !validarCorreo( input.correo ) ) {
            errores.correo = 'Formato inválido'
        }
    }
    if ( input.indicador ) {
        if ( !validarAlpha( false, input.indicador ) ) { // tildes?, valor
            errores.indicador = 'Formato inválido'
        }
    }
    return errores
}