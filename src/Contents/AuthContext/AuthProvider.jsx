import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../FireBase/firebase.init';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (cur) => { setUser(cur); setLoad(false); });
        return () => unsub();
    }, []);

    return <AuthContext.Provider value={{ user, load }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;