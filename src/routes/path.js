

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
    REWARDS:"/rewards",

    // PAYMENT
    PAYMENTSUCESS:"/payment-success",
    PAYMENTFAILED:"/payment-failed",

    // BUSINESS
    BUSINESS: "/business",
    BUSINESS_MATERIALS:"/business/materials",
    BUSINESS_TRANSACTION:"/business/transaction",
    BUSINESS_SUBSCRIPTIONS:"/business/subscriptions",
    BUSINESS_REEDEM_REWARDS:"/business/reedem-rewards",
    BUSINESS_WALLET:"/business/wallet",
    BUSINESS_PROFILE:"/business/profile",

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
}