import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../Pages/Home/Home";
import AuthLayout from "../Auth/AuthLayout";
import Employee from "../Auth/Employee";
import HRManager from "../Auth/HRManager";
import Login from "../Auth/Login";
import ErrorPage from "../Pages/Error/ErrorPage";

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
