import { validarVacio } from '../../utils/validaciones'

export const validarLlenado = ( input ) => {
    let errores = {}
    if ( !validarVacio( 'text', input.indicador ) ) {
        errores.indicador = 'Este campo es requerido'
    }
    if ( !validarVacio( 'text', input.contrasena ) ) {
        errores.contrasena = "Este campo es requerido"
    }
    return errores
}