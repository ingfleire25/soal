

import { useState, useEffect } from 'react'
import { api } from '../utils/axios'

export const useFetch = ( url ) => {
    const [ data, setData ] = useState( [] )
    const [ error, setError ] = useState( null )
    const [ loading, setLoading ] = useState( false )

    useEffect( () => {
        const abortController = new AbortController()
        const signal = abortController.signal // de repente la api está caída
        const fetchData = async () => {
            setLoading( true )
            try {
                const { data } = await api.get( url, { signal } )
                if ( !signal.aborted ) {
                    setData( data );
                    setError( null );
                }
            } catch ( error ) {
                if ( !signal.aborted ) {
                    setData( [] );
                    setError( error );
                }
            } finally {
                if ( !signal.aborted ) {
                    setLoading( false );
                }
            }
        }
        if ( url ) {
            fetchData()
        }
        return () => abortController.abort()
    }, [ url ] )
    return { data, error, loading }
}