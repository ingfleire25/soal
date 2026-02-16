
import React from 'react'
// import styles from './Pagination.module.css'
// import { BiArrowToLeft, BiArrowToRight, BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';

const Paginacion = ( { pagina, setPagina, totalPaginas } ) => {
    const sigPag = ( e ) => {
        if ( pagina < totalPaginas ) {
            setPagina( pagina + 1 )
        } else {
            return false
        }
    }
    const prevPagina = ( e ) => {
        if ( pagina > 1 ) {
            setPagina( pagina - 1 )
        } else {
            return false
        }
    }
    const primeraPag = ( e ) => {
        setPagina( 1 )
    }
    const ultimaPag = () => {
        setPagina( totalPaginas )
    }
    return (
        <div /*className={styles.container}*/>
            <button /*className={styles.pgBtn}*/ onClick={ primeraPag } disabled={ pagina === 1 ? true : false }>
                {/* <BiArrowToLeft /> */ }
                anterior
            </button>
            <button /*className={styles.pgBtn}*/ onClick={ prevPagina } disabled={ pagina === 1 ? true : false }>
                {/* <BiLeftArrowAlt /> */ }
            </button>
            <span>{ pagina } / { totalPaginas }</span>
            <button /*className={styles.pgBtn}*/ onClick={ sigPag } disabled={ pagina === totalPaginas ? true : false }>
                {/* <BiRightArrowAlt /> */ }
                siguiente
            </button>
            <button /*className={styles.pgBtn}*/ onClick={ ultimaPag } disabled={ pagina === totalPaginas ? true : false }>
                {/* <BiArrowToRight /> */ }
            </button>
        </div>
    )
}

//modificado por leonardo fleire 09/12/2025
//export default Paginacion