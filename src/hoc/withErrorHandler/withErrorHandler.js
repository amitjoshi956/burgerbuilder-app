import React, { useEffect, useState } from 'react'

import Aux from '../Aux/Aux'
import Modal from '../../components/UI/Modal/Modal'

const withReactHandler = (WrappedComponent, axios) => {

    return props => {
        const [error, setError] = useState(null)

        const errorConfirmedHandler = () => setError(null)

        const reqInterceptor = axios.interceptors.request.use(req => {
            setError(null)
            return req
        })

        const resInterceptor = axios.interceptors.response.use(res => res, err => setError(err))

        useEffect(() => {
            return () => {
                axios.interceptors.request.eject(reqInterceptor)
                axios.interceptors.response.eject(resInterceptor)
            }
        }, [reqInterceptor, resInterceptor])

        return (
            <Aux>
                <Modal show={error}
                    modalClosed={errorConfirmedHandler}>
                    {error ? error.message : null}
                </Modal>
                <WrappedComponent {...props} />
            </Aux>
        )

    }

}

export default withReactHandler