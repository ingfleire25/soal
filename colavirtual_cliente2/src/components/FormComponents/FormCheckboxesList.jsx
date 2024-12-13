import { useFetch } from '../../hooks/useFetch';
import './FormCheckboxesList.css'


const FormCheckboxesList = ( props ) => {
    const { label, onChange, attributes, state, url, errorMsg } = props; // el error es de validación
    const { data, error, loading } = useFetch( url )
    // if ( error ) alert( error ) // network error
    return (
        <>
            <label><strong>{ label }</strong></label>
            <div className='input-wrapper-row'>
                {
                    loading
                        ?
                        'Cargando...'
                        :
                        url
                            ? data.result?.map( ( chk ) => {
                                let checked = ''
                                let esta = state.find( c => c.id === chk.id )
                                if ( esta ) checked = 'checked'
                                return (
                                    <label
                                        className='wrapper-checkboxes'
                                        htmlFor={ chk.tx_nombre }
                                        key={ chk.id }
                                        style={ { marginTop: '.5rem', marginRight: '1rem' } }>
                                        <input
                                            type='checkbox'
                                            id={ chk.tx_nombre }
                                            value={ chk.id }
                                            onChange={ ( e ) => onChange( e.target, chk ) }
                                            checked={ checked }
                                            style={ { marginRight: '.2rem' } }
                                        />
                                        { chk.tx_nombre }
                                    </label>
                                )
                            } )
                            : null
                }
            </div>
            <span className='small error'>{ errorMsg || '\u00A0' }</span>
        </>
    );
};

export default FormCheckboxesList;