import { useAuth } from '../Contents/AuthContext/useAuth';

export const useUserData = () => {
    const { user } = useAuth();
    if (!user) return null;
    const data = JSON.parse(localStorage.getItem('userData')) || {};
    return { uid: user.uid, email: user.email, name: user.displayName || data.name || 'User', avatar: user.photoURL || data.profileImage || data.avatar || '', role: data.role || 'employee', ...data };
};
