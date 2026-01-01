import { clearToken } from '../Services/api';

export const useLogout = () => ({
    handleLogout: async () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        clearToken();
        window.dispatchEvent(new Event('storage'));
    }
});
