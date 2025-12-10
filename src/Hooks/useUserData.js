import { useAuth } from '../Contents/AuthContext/useAuth';

export const useUserData = () => {
    const { user } = useAuth();
    
    if (!user) return null;
    
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    return {
        uid: user.uid,
        email: user.email,
        name: user.displayName || userData.name || 'User',
        avatar: user.photoURL || userData.profileImage || userData.avatar || '',
        role: userData.role || 'employee',
        ...userData
    };
};
