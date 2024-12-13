import { validarAlpha } from '../../utils/validaciones'


export const validarFormato = ( input ) => {
    let errores = {}
    if ( input.indicador ) {
        if ( !validarAlpha( false, input.indicador ) ) { // tildes?, valor
            errores.indicador = 'Formato inválido'
        }
    }
    return errores
}