import { useEffect, useState } from "react";

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const dataResponse = await fetchFunction(); // Ejecutando la funcion

            setData(dataResponse);

        } catch (error) {
            if(error instanceof Error) {
                setError(error);
            } else {
                setError(new Error('An error occured'));
            }
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setData(null);
        setError(null);
        setLoading(false);
    }

    useEffect(() => {
        if(autoFetch) {
            fetchData();
        }
    }, []);

    return {
        data,
        loading,
        error,
        reFecth: fetchData,
        reset,
    }

}


export default useFetch;