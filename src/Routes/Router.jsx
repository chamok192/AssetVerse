import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../Pages/Home/Home";
import AuthLayout from "../Auth/AuthLayout";
import Employee from "../Auth/Employee";
import HRManager from "../Auth/HRManager";
import Login from "../Auth/Login";
import ErrorPage from "../Pages/Error/ErrorPage";
import ErrorBoundary from "../Components/ErrorBoundary";
import HRAssetDashboard from "../Pages/Dashboard/HR/HRAssetDashboard";
import AddAsset from "../Pages/Dashboard/HR/AddAsset";
import AllRequests from "../Pages/Dashboard/HR/AllRequests";
import EmployeeList from "../Pages/Dashboard/HR/EmployeeList";
import UpgradePackage from "../Pages/Dashboard/HR/UpgradePackage";
import HRProfile from "../Pages/Dashboard/HR/HRProfile";
import EmployeeDashboard from "../Pages/Dashboard/Employee/EmployeeDashboard";
import EmployeeAssets from "../Pages/Dashboard/Employee/EmployeeAssets";
import RequestAsset from "../Pages/Dashboard/Employee/RequestAsset";
import EmployeeTeam from "../Pages/Dashboard/Employee/EmployeeTeam";
import EmployeeProfile from "../Pages/Dashboard/Employee/EmployeeProfile";
import PrivateRoute from "./PrivateRoute";

const ProfileRouter = () => {
    const role = JSON.parse(localStorage.getItem("userData") || "{}").role?.toLowerCase();
    return role === "hr" ? <HRProfile /> : <EmployeeProfile />;
};

const Route = (path, role, Component) => ({
    path,
    element: <PrivateRoute requiredRole={role}>{Component}</PrivateRoute>
});

export const router = createBrowserRouter([
    {
        path: "/",
        element: <ErrorBoundary><RootLayout /></ErrorBoundary>,
        errorElement: <ErrorPage />,
        children: [
            { index: true, Component: Home, errorElement: <ErrorPage /> },
            {
                Component: AuthLayout,
                errorElement: <ErrorPage />,
                children: [
                    { path: "login", Component: Login, errorElement: <ErrorPage /> },
                    { path: "join/employee", Component: Employee, errorElement: <ErrorPage /> },
                    { path: "join/hr-manager", Component: HRManager, errorElement: <ErrorPage /> }
                ]
            },
            Route("hr/assets", "HR", <HRAssetDashboard />),
            Route("hr/assets/new", "HR", <AddAsset />),
            Route("hr/assets/:assetId/edit", "HR", <AddAsset />),
            Route("hr/requests", "HR", <AllRequests />),
            Route("hr/employees", "HR", <EmployeeList />),
            Route("hr/upgrade", "HR", <UpgradePackage />),
            Route("employee/dashboard", "Employee", <EmployeeDashboard />),
            Route("employee/assets", "Employee", <EmployeeAssets />),
            Route("employee/request", "Employee", <RequestAsset />),
            Route("employee/team", "Employee", <EmployeeTeam />),
            { path: "profile", element: <PrivateRoute><ProfileRouter /></PrivateRoute>, errorElement: <ErrorPage /> },
            { path: "*", Component: ErrorPage, errorElement: <ErrorPage /> }
        ]
    },
    { path: "*", Component: ErrorPage, errorElement: <ErrorPage /> }
]);
