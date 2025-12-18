import { useAuth } from '../Contents/AuthContext/useAuth';

export const useUserData = () => {
    const { user } = useAuth();
    return user;
};
