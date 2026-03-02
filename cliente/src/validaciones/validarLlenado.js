// import { validarVacio } from '../../utils/validaciones'
import { validarVacio } from '../utils/validaciones'

export const validarLlenado = ( input ) => {
    let errores = {}
    if ( !validarVacio( 'text', input.cedula ) ) {
        errores.cedula = "Este campo es requerido"
    }
    if ( !validarVacio( 'text', input.nombre ) ) {
        errores.nombre = "Este campo es requerido"
    }
    if ( !validarVacio( 'text', input.apellido ) ) {
        errores.apellido = "Este campo es requerido"
    }
    if ( !validarVacio( 'text', input.correo ) ) {
        errores.correo = "Este campo es requerido"
    }
    if ( !validarVacio( 'select', input.estado ) ) {
        errores.estado = "Este campo es requerido"
    } else if ( input.estado === 'SOBREVIVIENTE' ) {
        if ( !validarVacio( 'text', input.trabajador ) ) {
            errores.trabajador = 'Este campo es requerido'
        }
    } else if ( input.estado === 'ACTIVO' ) {
        if ( !validarVacio( 'text', input.indicador ) ) {
            errores.indicador = 'Este campo es requerido'
        }
    }
    if ( !validarVacio( 'select', input.zona ) ) {
        errores.zona = "Este campo es requerido"
    }
    if ( !validarVacio( 'select', input.area ) ) {
        errores.area = "Este campo es requerido"
    }
    if ( !validarVacio( 'select', input.localidad ) ) {
        errores.localidad = "Este campo es requerido"
    }
    if ( !validarVacio( 'select', input.uaId ) ) {
        errores.uaId = "Este campo es requerido"
    }
    if ( !validarVacio( 'select', input.categoria ) ) {
        errores.categoria = "Este campo es requerido"
    }
    
    return errores
}