import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-base-100 to-base-200 flex items-center justify-center px-4 py-10 overflow-x-hidden">
            <div className="w-full max-w-7xl">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
