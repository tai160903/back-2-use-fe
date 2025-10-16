import BussinessLayout from "../layouts/BussinessLayout/BussinessLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import Users from "../pages/Admin/Users";
import Business from "../pages/Admin/Business";
import Analytics from "../pages/Admin/Analytics";
import Reports from "../pages/Admin/Reports";
import Settings from "../pages/Admin/Settings";
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
import Profile from "../pages/Home/Profile/Profile";
import StorePage from "../pages/Home/Store/StorePage";
import TransactionHistory from "../pages/Home/TransactionHistory/TransactionHistory";
import WalletCustomer from "../pages/Home/WalletCustomer/WalletCustomer";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import ForgotPassword from "../pages/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword/ResetPassword";
import GoogleCallback from "../pages/Auth/GoogleCallback/GoogleCallback";
import Registration from "../pages/Admin/Registration/Registration";
import UserDashborad from "../pages/Home/UserDashborad/UserDashborad";
import LandingLayout from "../layouts/LandingLayout/LandingLayout"; 
import ListStore from "../pages/Home/ListStore/ListStore";
// Features page removed per requirement to replace with Rankings
import Pricing from "../pages/Home/Pricing/Pricing";
import About from "../pages/Home/About/About";
import PaymentSuccess from "../pages/Home/Paymenrt/PaymentSuccess";
import PaymentFailed from "../pages/Home/Paymenrt/PaymentFailed";
import StoreDetail from "../pages/Home/Store/StoreDetail";
import Rankings from "../pages/Home/Rankings/Rankings";
import ProductDetail from "../pages/Home/Store/ProductDetail";

export default function useRouterElements() {
  const elements = useRoutes([
    // Landing page route với LandingLayout
    {
      path: PATH.HOME,
      element: <LandingLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: PATH.LISTSTORE,
          element: (
            <ProtectedRoute allowAnonymous>
              <ListStore />
            </ProtectedRoute>
          ),
        },
        // Features route removed. Rankings route is defined below.
        {
          path: PATH.PRICING,
          element: <Pricing />,
        },
        {
          path: PATH.ABOUT,
          element: <About />,
        },
        {
          path: PATH.PAYMENTSUCESS,
          element: <PaymentSuccess />,
        },
        {
          path: PATH.PAYMENTFAILED,
          element: <PaymentFailed />,
        },
          {
          path: PATH.STOREDETAIL,
          element: <StoreDetail />,
        },
        {
          path: PATH.RANKINGS,
          element: <Rankings />,
        },
        {
          path: PATH.PRODUCT_DETAIL,
          element: <ProductDetail />,
        },
      ],
    },

    // Auth routes
    {
      path: PATH.AUTH,
      element: <AuthLayout />,
      children: [
        {
          path: PATH.LOGIN,
          element: (
            <ProtectedRoute allowAnonymous>
              <Login />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.REGISTER,
          element: (
            <ProtectedRoute allowAnonymous>
              <Register />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.REGISTERBUSSINESS,
          element: (
            <ProtectedRoute allowAnonymous>
              <RegisterBussiness />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.FORGOTPASSWORD,
          element: (
            <ProtectedRoute allowAnonymous>
              <ForgotPassword />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.RESETPASSWORD,
          element: (
            <ProtectedRoute allowAnonymous>
              <ResetPassword />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.GOOGLECALLBACK,
          element: (
            <ProtectedRoute allowAnonymous>
              <GoogleCallback />
            </ProtectedRoute>
          ),
        },
      ],
    },

    // User routes với MainLayout
    {
      path: PATH.HOME,
      element: <MainLayout />,
      children: [
        {
          path: PATH.PROFILE,
          element: (
            <ProtectedRoute allowedRoles={["customer", "business", "admin"]}>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.STORE,
          element: (
            <ProtectedRoute allowedRoles={["customer", "business"]}>
              <StorePage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.TRANSACTION_HISTORY,
          element: (
            <ProtectedRoute allowedRoles={["customer", "business"]}>
              <TransactionHistory />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.WALLET_CUSTOMER,
          element: (
            <ProtectedRoute allowedRoles={["customer"]}>
              <WalletCustomer />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.USER_DASHBOARD,
          element: (
            <ProtectedRoute allowedRoles={["customer"]}>
              <UserDashborad />
            </ProtectedRoute>
          ),
        },
      ],
    },

    // Business routes
    {
      path: PATH.BUSINESS,
      element: <BussinessLayout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute allowedRoles={["business"]}>
              <BusinessDashboard />
            </ProtectedRoute>
          ),
        },
      ],
    },

    // Admin routes
    {
      path: PATH.ADMIN,
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <AdminDashboard />,
        },
        {
          path: PATH.ADMIN_USERS,
          element: <Users />,
        },
        {
          path: PATH.ADMIN_BUSINESS,
          element: <Business />,
        },
        {
          path: PATH.ADMIN_ANALYTICS,
          element: <Analytics />,
        },
        {
          path: PATH.ADMIN_REPORTS,
          element: <Reports />,
        },
        {
          path: PATH.ADMIN_SETTINGS,
          element: <Settings />,
        },

        {
          path: PATH.ADMIN_REGISTRATION,
          element: <Registration />,
        },
      ],
    },
  ]);
  return elements;
}
