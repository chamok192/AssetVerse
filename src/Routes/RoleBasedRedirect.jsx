import { useEffect } from "react";
import { useNavigate } from "react-router";

const RoleBasedRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        
        if (userData) {
            try {
                const user = JSON.parse(userData);
                const userRole = user.role?.toLowerCase();
                
                if (userRole === 'hr') {
                    navigate('/hr/assets', { replace: true });
                } else if (userRole === 'employee') {
                    navigate('/employee/assets', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            } catch {
                navigate('/', { replace: true });
            }
        } else {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    return null;
};

export default RoleBasedRedirect;
