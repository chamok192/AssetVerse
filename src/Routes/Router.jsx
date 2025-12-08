import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../Pages/Home/Home";
import Employee from "../Pages/Join/Employee";
import HRManager from "../Pages/Join/HRManager";
import ErrorPage from "../Pages/Error/ErrorPage";
import Login from "../Pages/Login/Login";

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
