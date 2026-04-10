import React, { use, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'
import AuthLoader from './AuthLoader'

function PublicOnlyRoute() {

    const { isAuth , checkAuthentication} = useAuth()


    useEffect(() => {
        checkAuthentication();
    }, []);

    if (isAuth === null) {
        return <AuthLoader />
    }

    if (isAuth === true) {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet/>
}

export default PublicOnlyRoute