import BussinessLayout from "../layouts/BussinessLayout/BussinessLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import Subscriptions from "../pages/Admin/Subscriptions/Subscriptions";
import Analytics from "../pages/Admin/Analytics";
import Store from "../pages/Admin/Store";
import Settings from "../pages/Admin/Settings";
import BusinessDashboard from "../pages/Bussiness/BusinessDashboard/BussinessDashbord";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import HomePage from "../pages/Home/HomePage/HomePage";
import { PATH } from "./path";
import { useRoutes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import MainLayout from "../layouts/MainLayout/MainLayout";
import RegisterBussiness from "../pages/Auth/RegisterBussiness/RegisterBussiness";
import BusinessRegistrationStatus from "../pages/Auth/BusinessRegistrationStatus/BusinessRegistrationStatus";
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
import Users from "../pages/Admin/UserManage/Users";
import Material from "../pages/Admin/Material";
import Voucher from "../pages/Home/Voucher/Voucher";
import Materials from "../pages/Bussiness/Materials/Materials";
import RedemVoucher from "../pages/Bussiness/RedeemVoucher/RedemVoucher";
import Subscription from "../pages/Bussiness/Subscription/Subscription";
import Transactions from "../pages/Bussiness/BusinessTransaction/BusinessTransaction";
import WalletBusiness from "../pages/Bussiness/WalletBusiness/WalletBusiness";
import BusinessTransaction from "../pages/Bussiness/BusinessTransaction/BusinessTransaction";
import ProfileBusiness from "../pages/Bussiness/ProfileBusiness/ProfileBusiness";
import Rewards from "../pages/Home/Rewards/Rewards";
import CustomerLegacyData from "../pages/Bussiness/CustomerLegacyData/CustomerLegacyData";
import InventoryManagement from "../pages/Bussiness/Inventory/InventoryManagement";

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
        {
          path: PATH.VOUCHERS,
          element: <Voucher />,
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
          path: PATH.REWARDS,
          element: (
            <ProtectedRoute allowedRoles={["customer"]}>
              <Rewards />
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
        {
          path: PATH.BUSINESS_REGISTRATION_STATUS,
          element: (
            <ProtectedRoute allowedRoles={["customer"]}>
              <BusinessRegistrationStatus />
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
        {
          path: PATH.BUSINESS_MATERIALS,
          element: (
            <ProtectedRoute allowedRoles={["business"]}>
              <Materials />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.BUSINESS_SUBSCRIPTIONS,
          element: (
            <ProtectedRoute allowedRoles={["business"]}>
              <Subscription />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.BUSINESS_REEDEM_REWARDS,
          element: (
            <ProtectedRoute allowedRoles={["business"]}>
              <RedemVoucher />
            </ProtectedRoute>
          ),
        },

        {
          path: PATH.BUSINESS_WALLET,
          element: (
            <ProtectedRoute allowedRoles={["business"]}>
              <WalletBusiness />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.BUSINESS_TRANSACTION,
          element: (
            <ProtectedRoute allowedRoles={["business"]}>
              <BusinessTransaction />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.BUSINESS_MY_CUSTOMER_HISTORY,
          element: (
            <ProtectedRoute allowedRoles={["business"]}>
              <CustomerLegacyData />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.BUSINESS_INVENTORY,
          element: (
            <ProtectedRoute allowedRoles={["business"]}>
              <InventoryManagement />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.BUSINESS_PROFILE,
          element: (
            <ProtectedRoute allowedRoles={["business"]}>
              <ProfileBusiness />
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
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.ADMIN_USERS,
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.ADMIN_SUBSCRIPTIONS,
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <Subscriptions />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.ADMIN_ANALYTICS,
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <Analytics />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.ADMIN_VOUCHER,
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <Analytics />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.ADMIN_STORE,
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <Store />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.ADMIN_SETTINGS,
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <Settings />
            </ProtectedRoute>
          ),
        },

        {
          path: PATH.ADMIN_MATERIAL,
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <Material />
            </ProtectedRoute>
          ),
        },

        {
          path: PATH.ADMIN_REGISTRATION,
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <Registration />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
  return elements;
}
