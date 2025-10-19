

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

    // PAYMENT
    PAYMENTSUCESS:"/payment-success",
    PAYMENTFAILED:"/payment-failed",

    // BUSINESS
    BUSINESS: "/business",

    // ADMIN
    ADMIN: "/admin",
    ADMIN_USERS: "/admin/users",
    ADMIN_REGISTRATION: "/admin/registration",
    ADMIN_SUBSCRIPTIONS: "/admin/subscriptions",
    ADMIN_ANALYTICS: "/admin/analytics",
    ADMIN_SETTINGS: "/admin/settings",
    ADMIN_REPORTS: "/admin/reports",
    ADMIN_MATERIAL: "/admin/material",
}