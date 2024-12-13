// si true: no hay error

const regexConTildes = /^([a-zA-Z\sÁÉÍÓÚáéíóúÑñ]+)$/
const regexSinTildes = /^([a-zA-Z]+)$/
const regexNumeros = /^[0-9]*$/
const regexAlphaNum = /^([a-zA-Z\sÁÉÍÓÚáéíóúÑñ0-9]+)$/
const regexCorreo = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

export const validarAlpha = ( tildes, valor ) => {
    return tildes ? regexConTildes.test( valor ) : regexSinTildes.test( valor )
}

export const validarNum = ( valor ) => {
    return regexNumeros.test( valor )
}

export const validarAlphaNum = ( valor ) => {
    return regexAlphaNum.test( valor )
}

export const validarCorreo = ( valor ) => {
    return regexCorreo.test( valor )
}

export const validarVacio = ( tipo, valor ) => {
    if ( tipo === 'text' || tipo === 'date' ) return Boolean( valor.trim() )
    if ( tipo === 'select' ) return valor !== "0"
}