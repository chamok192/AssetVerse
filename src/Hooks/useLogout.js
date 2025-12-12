import { auth } from '../FireBase/firebase.init';
import { signOut } from 'firebase/auth';
import { clearToken } from '../Services/api';

export const useLogout = () => {
    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('userData');
            clearToken();
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return { handleLogout };
};
