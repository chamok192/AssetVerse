import { Navigate } from "react-router";

const PrivateRoute = ({ children, requiredRole }) => {
    const userData = localStorage.getItem('userData');
    
    if (!userData) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userData);
        
        // Check if user has the required role
        if (requiredRole) {
            const userRole = user.role?.toLowerCase();
            const required = requiredRole.toLowerCase();
            
            if (userRole !== required) {
                // Redirect to appropriate dashboard based on actual role
                if (userRole === 'hr') {
                    return <Navigate to="/hr/assets" replace />;
                } else if (userRole === 'employee') {
                    return <Navigate to="/employee/dashboard" replace />;
                } else {
                    return <Navigate to="/" replace />;
                }
            }
        }
        
        return children;
    } catch (error) {
        return <Navigate to="/login" replace />;
    }
};

export default PrivateRoute;
