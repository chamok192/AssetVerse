import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../FireBase/firebase.init';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [load, setLoad] = useState(true);


    // Fetch and sync user profile
    const fetchAndSyncUserProfile = async (firebaseUser) => {
        if (!firebaseUser?.email) {
            setUser(null);
            setLoad(false);
            return;
        }
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                setUser(firebaseUser);
                setLoad(false);
                return;
            }
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const userData = await res.json();
                localStorage.setItem('userData', JSON.stringify(userData));
                setUser({ ...firebaseUser, ...userData });
            } else {
                setUser(firebaseUser);
            }
        } catch {
            setUser(firebaseUser);
        } finally {
            setLoad(false);
        }
    };

    const refetchProfile = async () => {
        const firebaseUser = auth.currentUser;
        if (firebaseUser) {
            await fetchAndSyncUserProfile(firebaseUser);
        }
    };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (cur) => {
            fetchAndSyncUserProfile(cur);
        });
        return () => unsub();
    }, []);

    return <AuthContext.Provider value={{ user, load, refetchProfile }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;