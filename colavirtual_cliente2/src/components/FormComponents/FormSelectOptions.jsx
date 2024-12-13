import { useFetch } from "../../hooks/useFetch";


const FormSelectOptions = ( { url, setLoading } ) => {
    const { data, error, loading } = useFetch( url ) // el error es de petición
    // console.log( "Estoy imprimiendo el error desde selectOptions: ", error )
    // if ( setLoading ) setLoading( loading ) // si el usuario no está autenticado, la categoría "gestión" no debe verla
    if ( error ) alert( error.statusText || "Sin respuesta de parte del servidor." )
    // console.error( error )
    return (
        <>
            { loading ?
                <option value="-1">'Cargando...'</option>
                :
                data.result?.map( ( opt ) => {
                    return <option value={ opt.id } key={ opt.id }>{ opt.tx_nombre }</option>
                } )
            }
        </>
    );
};

export default FormSelectOptions;