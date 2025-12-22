

export const PATH = {
    // auth
    AUTH: "/auth",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REGISTERBUSSINESS: "/auth/register/bussiness",
    FORGOTPASSWORD:"/auth/forgotpassword",
    RESETPASSWORD: "/auth/reset-password",
    ACTIVEACCOUNT: "/active-account",
    GOOGLECALLBACK:"/auth/googleCallback",


    // USER
    HOME: "/",
    PROFILE:"/profile",
    STORE:"/store",
    TRANSACTION_HISTORY:"/transaction_history",
    WALLET_CUSTOMER:"/walllet_customer",
    USER_DASHBOARD:"/user_dashborad",
    LISTSTORE:"/liststore",
    STOREDETAIL:"/storeDetail/:id",
    PRODUCT_DETAIL:"/product/:storeId/:productId",
    VOUCHERS:"/vouchers",
    PRICING:"/pricing",
    ABOUT:"/about",
    RANKINGS: "/rankings",
    REWARDS:"/voucherwallet",
    BUSINESS_REGISTRATION_STATUS: "/business-registration-status",
    CUSTOMER_CO2_REPORT:"/co2-report",
    CUSTOMER_TRANSACTION_DETAIL:"/co2-report/transaction/:id",

    // PAYMENT
    PAYMENTSUCESS:"/payment-success",
    PAYMENTFAILED:"/payment-failed",

    // BUSINESS
    BUSINESS: "/business",
    BUSINESS_INVENTORY:"/business/inventory",
    BUSINESS_INVENTORY_ITEMS:"/business/inventory/:productGroupId/items",
    BUSINESS_INVENTORY_SIZES:"/business/inventory/:productGroupId/sizes",
    BUSINESS_MATERIALS:"/business/materials",
    BUSINESS_TRANSACTION:"/business/transaction",
    BUSINESS_CO2_REPORT:"/business/co2-report",
    BUSINESS_TRANSACTION_DETAIL:"/business/co2-report/transaction/:id",
    BUSINESS_SUBSCRIPTIONS:"/business/subscriptions",
    BUSINESS_REEDEM_REWARDS:"/business/reedem-rewards",
    BUSINESS_WALLET:"/business/wallet",
    BUSINESS_PROFILE:"/business/profile",
    BUSINESS_MY_CUSTOMER_HISTORY:"/business/my-customer-history",
    BUSINESS_STAFF:"/business/staff",

    // STAFF
    STAFF: "/staff",
    STAFF_PROFILE: "/staff/profile",
    STAFF_ONLINE_BORROW_ORDERS: "/staff/online-borrow-orders",
    STAFF_VOUCHER: "/staff/voucher",
    STAFF_TRANSACTION: "/staff/transaction",

    // ADMIN
    ADMIN: "/admin",
    ADMIN_USERS: "/admin/users",
    ADMIN_REGISTRATION: "/admin/registration",
    ADMIN_SUBSCRIPTIONS: "/admin/subscriptions",
    ADMIN_ANALYTICS: "/admin/analytics",
    ADMIN_VOUCHER: "/admin/voucher",
    ADMIN_SETTINGS: "/admin/settings",
    ADMIN_STORE: "/admin/store",
    ADMIN_MATERIAL: "/admin/material",
    ADMIN_MATERIAL_DETAIL: "/admin/material/:id",
    ADMIN_ECO_REWARD: "/admin/eco-reward",
    ADMIN_LEADERBOARD: "/admin/leaderboard",
    // Admin Dashboard Sub Pages
    ADMIN_DASHBOARD_BORROW_TRANSACTIONS: "/admin/dashboard/borrow-transactions",
    ADMIN_DASHBOARD_BUSINESS_MONTHLY: "/admin/dashboard/business-monthly",
    ADMIN_DASHBOARD_WALLET_OVERVIEW: "/admin/dashboard/wallet-overview",
    ADMIN_DASHBOARD_WALLET_TRANSACTIONS_MONTHLY: "/admin/dashboard/wallet-transactions-monthly",
    ADMIN_DASHBOARD_TOP_BUSINESSES: "/admin/dashboard/top-businesses",
    ADMIN_DASHBOARD_TOP_CUSTOMERS: "/admin/dashboard/top-customers",
    ADMIN_DASHBOARD_CHARTS: "/admin/dashboard/charts",
    ADMIN_DASHBOARD_QUICK_ACTIONS: "/admin/dashboard/quick-actions",
    ADMIN_DASHBOARD_BUSINESS_TRANSACTIONS: "/admin/dashboard/business-transactions/:businessId",
    ADMIN_DASHBOARD_CUSTOMER_TRANSACTIONS: "/admin/dashboard/customer-transactions/:customerId",
}