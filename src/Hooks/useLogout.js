import { auth } from '../FireBase/firebase.init';
import { signOut } from 'firebase/auth';

export const useLogout = () => {
    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('userData');
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return { handleLogout };
};
