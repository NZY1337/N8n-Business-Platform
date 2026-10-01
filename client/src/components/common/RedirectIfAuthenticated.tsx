import { Navigate, Outlet } from 'react-router';
import { useAppContext } from '../../context/AppContext';

const RedirectIfAuthenticated = () => {
    const { session, sessionLoaded } = useAppContext();

    if (!sessionLoaded) return null;

    if (session) return <Navigate to="/dashboard" replace />;
    return <Outlet />;
};

export default RedirectIfAuthenticated;
