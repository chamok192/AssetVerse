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
import Payments from "../Pages/Dashboard/HR/Payments";
import EmployeeAssets from "../Pages/Dashboard/Employee/EmployeeAssets";
import RequestAsset from "../Pages/Dashboard/Employee/RequestAsset";
import EmployeeTeam from "../Pages/Dashboard/Employee/EmployeeTeam";
import PaymentSuccess from "../Pages/PaymentSuccess";
import PrivateRoute from "./PrivateRoute";
import ProfileRouter from "./ProfileRouter";

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
            {
                path: "hr/assets",
                element: (
                    <PrivateRoute>
                        <HRAssetDashboard />
                    </PrivateRoute>
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "hr/assets/new",
                element: (
                    <PrivateRoute>
                        <AddAsset />
                    </PrivateRoute>
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "hr/assets/:assetId/edit",
                element: (
                    <PrivateRoute>
                        <AddAsset />
                    </PrivateRoute>
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "hr/requests",
                element: (
                    <PrivateRoute>
                        <AllRequests />
                    </PrivateRoute>
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "hr/employees",
                element: (
                    <PrivateRoute>
                        <EmployeeList />
                    </PrivateRoute>
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "hr/upgrade",
                element: (
                    <PrivateRoute>
                        <UpgradePackage />
                    </PrivateRoute>
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "hr/payments",
                element: (
                    <PrivateRoute>
                        <Payments />
                    </PrivateRoute>
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "payments",
                element: (
                    <PrivateRoute>
                        <Payments />
                    </PrivateRoute>
                ),
                errorElement: <ErrorPage />
            },
            { path: "payment-success", element: <PaymentSuccess />, errorElement: <ErrorPage /> },
            {
                path: "employee/assets",
                element: (
                    <PrivateRoute>
                        <EmployeeAssets />
                    </PrivateRoute>
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "employee/request",
                element: (
                    <PrivateRoute>
                        <RequestAsset />
                    </PrivateRoute>
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "employee/team",
                element: (
                    <PrivateRoute>
                        <EmployeeTeam />
                    </PrivateRoute>
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "profile",
                element: (
                    <PrivateRoute>
                        <ProfileRouter />
                    </PrivateRoute>
                ),
                errorElement: <ErrorPage />
            },
            { path: "*", Component: ErrorPage, errorElement: <ErrorPage /> }
        ]
    },
    { path: "*", Component: ErrorPage, errorElement: <ErrorPage /> }
]);
