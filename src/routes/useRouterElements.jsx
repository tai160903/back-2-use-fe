import BussinessLayout from "../layouts/BussinessLayout/BussinessLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import BusinessDashboard from "../pages/Bussiness/BussinessDashbord";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import HomePage from "../pages/Home/HomePage/HomePage";
import { PATH } from "./path";
import { useRoutes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import MainLayout from "../layouts/MainLayout/MainLayout";
import RegisterBussiness from "../pages/Auth/RegisterBussiness/RegisterBussiness";

export default function useRouterElements() {
  const elements = useRoutes([
    // auth
    {
      path: PATH.AUTH,
      element: <AuthLayout />,
      children: [
        {
          path: PATH.LOGIN,
          element: <Login />,
        },
        {
          path: PATH.REGISTER,
          element: <Register />,
        },
         {
          path: PATH.REGISTERBUSSINESS,
          element: <RegisterBussiness />,
        },
      ],
    },

    // user
    {
      path: PATH.HOME,
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
      ],
    },

    // business
    {
        path: PATH.BUSINESS,
        element: <BussinessLayout />,
        children: [
          {
            index: true,
            element: <BusinessDashboard />,
          },
        ],
    },

    // admin
    {
        path: PATH.ADMIN,
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
        ],
    }
  ]);
  return elements;
}


