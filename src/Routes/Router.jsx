import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../Pages/Home/Home";
import AuthLayout from "../Auth/AuthLayout";
import Employee from "../Auth/Employee";
import HRManager from "../Auth/HRManager";
import Login from "../Auth/Login";
import ErrorPage from "../Pages/Error/ErrorPage";
import HRAssetDashboard from "../Pages/Dashboard/HRAssetDashboard";
import AddAsset from "../Pages/Dashboard/AddAsset";
import AllRequests from "../Pages/Dashboard/AllRequests";
import EmployeeList from "../Pages/Dashboard/EmployeeList";
import UpgradePackage from "../Pages/Dashboard/UpgradePackage";
import HRProfile from "../Pages/Dashboard/HRProfile";
import PrivateRoute from "./PrivateRoute";
import RoleBasedRedirect from "./RoleBasedRedirect";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children:[
            {
                index: true,
                Component:Home
            },
            {
                Component: AuthLayout,
                children: [
                    {
                        path: "login",
                        Component: Login
                    },
                    {
                        path: "join/employee",
                        Component: Employee
                    },
                    {
                        path: "join/hr-manager",
                        Component: HRManager
                    }
                ]
            },
            {
                path: "hr/assets",
                element: <PrivateRoute requiredRole="HR"><HRAssetDashboard /></PrivateRoute>
            },
            {
                path: "hr/assets/new",
                element: <PrivateRoute requiredRole="HR"><AddAsset /></PrivateRoute>
            },
            {
                path: "hr/assets/:assetId/edit",
                element: <PrivateRoute requiredRole="HR"><AddAsset /></PrivateRoute>
            },
            {
                path: "hr/requests",
                element: <PrivateRoute requiredRole="HR"><AllRequests /></PrivateRoute>
            },
            {
                path: "hr/employees",
                element: <PrivateRoute requiredRole="HR"><EmployeeList /></PrivateRoute>
            },
            {
                path: "hr/upgrade",
                element: <PrivateRoute requiredRole="HR"><UpgradePackage /></PrivateRoute>
            },
            {
                path: "profile",
                element: <PrivateRoute requiredRole="HR"><HRProfile /></PrivateRoute>
            },
            {
                path: "*",
                Component: ErrorPage
            }
        ]
    },
    {
        path: "*",
        Component: ErrorPage
    }
]);
