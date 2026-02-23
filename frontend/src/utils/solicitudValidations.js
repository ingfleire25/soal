import { validarAlpha, validarCorreo, validarVacio } from './validaciones'

export const validarFormato = ( input ) => {
  let errores = {}
  if ( input.nombre ) {
    if ( !validarAlpha( true, input.nombre ) ) {
      errores.nombre = 'Formato inválido'
    }
  }
  if ( input.apellido ) {
    if ( !validarAlpha( true, input.apellido ) ) {
      errores.apellido = 'Formato inválido'
    }
  }
  if ( input.correo ) {
    if ( !validarCorreo( input.correo ) ) {
      errores.correo = 'Formato inválido'
    }
  }
  if ( input.indicador ) {
    if ( !validarAlpha( false, input.indicador ) ) {
      errores.indicador = 'Formato inválido'
    }
  }
  return errores
}

export const validarLlenado = ( input ) => {
  let errores = {}
  if ( !validarVacio( 'text', input.cedula || '' ) ) {
    errores.cedula = "Este campo es requerido"
  }
  if ( !validarVacio( 'text', input.nombre || '' ) ) {
    errores.nombre = "Este campo es requerido"
  }
  if ( !validarVacio( 'text', input.apellido || '' ) ) {
    errores.apellido = "Este campo es requerido"
  }
  if ( !validarVacio( 'text', input.correo || '' ) ) {
    errores.correo = "Este campo es requerido"
  }
  if ( !validarVacio( 'select', input.estado || '0' ) ) {
    errores.estado = "Este campo es requerido"
  } else if ( input.estado === 'SOBREVIVIENTE' ) {
    if ( !validarVacio( 'text', input.trabajador || '' ) ) {
      errores.trabajador = 'Este campo es requerido'
    }
  } else if ( input.estado === 'ACTIVO' ) {
    if ( !validarVacio( 'text', input.indicador || '' ) ) {
      errores.indicador = 'Este campo es requerido'
    }
  }
  if ( !validarVacio( 'select', input.zona || '0' ) ) {
    errores.zona = "Este campo es requerido"
  }
  if ( !validarVacio( 'select', input.area || '0' ) ) {
    errores.area = "Este campo es requerido"
  }
  if ( !validarVacio( 'select', input.localidad || '0' ) ) {
    errores.localidad = "Este campo es requerido"
  }
  if ( !validarVacio( 'select', input.uaId || '0' ) ) {
    errores.uaId = "Este campo es requerido"
  }
  if ( !validarVacio( 'select', input.categoria || '0' ) ) {
    errores.categoria = "Este campo es requerido"
  }
  if ( !input.tipos || !input.tipos.length ) {
    errores.tipo = "Debe seleccionar mínimo 1 tópico"
  }
  if ( !validarVacio( 'date', input.fh_atencion || '' ) ) {
    errores.fh_atencion = "Este campo es requerido"
  }
  return errores
}
