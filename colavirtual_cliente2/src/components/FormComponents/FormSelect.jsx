// import { useFetch } from "../hooks/useFetch";
import FormSelectOptions from "./FormSelectOptions";


const FormSelect = ( props ) => {
    const { label, errorMsg, onChange, attributes, url, setLoading } = props; // el error es de validación
    return (
        <>
            <label htmlFor={ attributes.name }><strong>{ label }</strong></label>
            <select { ...attributes } onChange={ onChange }>
                <option value="0">Seleccione una opción</option>
                {
                    <FormSelectOptions url={ url } setLoading={ setLoading } />
                }
            </select>
            {/* { loading ? 'Cargando...' : null } */ }
            <span className="small error">{ errorMsg || '\u00A0' }</span>
        </>
    );
};

export default FormSelect;

// import { useEffect } from 'react'

// const FormSelect = ( props ) => {
//     const { nombre, valores, handleChange } = props
//     return (
//         // <div className='input-wrapper-col'>
//         <>
//             <label htmlFor={ nombre }>{ nombre[ 0 ].toUpperCase() + nombre.slice( 1 ) }:</label>
//             <select name={ nombre } id={ nombre } onChange={ handleChange }>
//                 <option>Seleccione un { nombre }</option>
//                 {
//                     valores.map( ( v ) => {
//                         return <option key={ v.id } value={ v.id }>{ v.nombre }</option>
//                     } )
//                 }
//             </select>
//             { loading && "Cargando..." }
//             <span className='small'>{ error ? error : "&nbsp;" }</span>
//         </>
//         // </div>
//     )
// }

// export default FormSelect