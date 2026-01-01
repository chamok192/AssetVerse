import { useState, useEffect } from "react";
import { Navigate } from "react-router";

const PrivateRoute = ({ children, requiredRole }) => {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            if (token && userData.email) {
                setIsAuth(true);
                const userRole = userData.role ? String(userData.role).trim().toLowerCase() : null;
                setRole(userRole);
            } else {
                setIsAuth(false);
                setRole(null);
            }
            setLoading(false);
        };

        checkAuth();

        // Listen for storage changes
        const handleStorage = () => checkAuth();
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    if (!isAuth) return <Navigate to="/login" replace />;
    
    if (requiredRole) {
        const required = requiredRole.toLowerCase();
        const userRole = role ? String(role).toLowerCase() : null;
        
        if (userRole !== required) {
            const path = userRole === 'hr' ? '/hr/assets' : userRole === 'employee' ? '/employee/assets' : '/';
            return <Navigate to={path} replace />;
        }
    }

    return children;
};

export default PrivateRoute;
