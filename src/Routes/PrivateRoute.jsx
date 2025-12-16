import { useState, useEffect } from "react";
import { Navigate } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../FireBase/firebase.init";

const PrivateRoute = ({ children, requiredRole }) => {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const getRoleFromStorage = () => {
            try {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const userRole = userData.role ? String(userData.role).trim().toLowerCase() : null;
                return userRole;
            } catch (err) {
                return null;
            }
        };

        const initialRole = getRoleFromStorage();
        if (initialRole) setRole(initialRole);

        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuth(true);
                const storedRole = getRoleFromStorage();
                if (storedRole) setRole(storedRole);
            } else {
                setIsAuth(false);
                setRole(null);
            }
            setLoading(false);
        });
        return unsub;
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    if (!isAuth) return <Navigate to="/login" replace />;
    
    if (requiredRole) {
        const required = requiredRole.toLowerCase();
        
        if (role !== required) {
            const path = role === 'hr' ? '/hr/assets' : role === 'employee' ? '/employee/dashboard' : '/';
            return <Navigate to={path} replace />;
        }
    }

    return children;
};

export default PrivateRoute;
