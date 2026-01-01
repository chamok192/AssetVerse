import { useEffect, useState } from 'react';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [load, setLoad] = useState(true);

    const refetchProfile = async () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoad(false);
            return;
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
                localStorage.setItem('userData', JSON.stringify(userData));
            } else {
                // Keep existing user if fetch fails
                const storedUser = localStorage.getItem('userData');
                setUser(storedUser ? JSON.parse(storedUser) : null);
            }
        } catch {
            // Keep existing user if fetch fails
            const storedUser = localStorage.getItem('userData');
            setUser(storedUser ? JSON.parse(storedUser) : null);
        } finally {
            setLoad(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        refetchProfile();
    }, []);

    // Listen to storage changes
    useEffect(() => {
        const handleStorage = () => {
            const storedUser = localStorage.getItem('userData');
            setUser(storedUser ? JSON.parse(storedUser) : null);
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return <AuthContext.Provider value={{ user, load, refetchProfile }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;