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
                Component: HRAssetDashboard
            },
            {
                path: "hr/assets/new",
                Component: AddAsset
            },
            {
                path: "hr/assets/:assetId/edit",
                Component: AddAsset
            },
            {
                path: "hr/requests",
                Component: AllRequests
            },
            {
                path: "hr/employees",
                Component: EmployeeList
            },
            {
                path: "hr/upgrade",
                Component: UpgradePackage
            },
            {
                path: "profile",
                Component: HRProfile
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
