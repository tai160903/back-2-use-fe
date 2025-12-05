// Auth utility functions
export const getCurrentUser = () => {
    try {
        const user = localStorage.getItem("currentUser");
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Error parsing currentUser from localStorage:", error);
        localStorage.removeItem("currentUser");
        return null;
    }
};

export const clearAuthData = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
};

export const isAuthenticated = () => {
    const user = getCurrentUser();
    return user && user.accessToken;
};

// Chuẩn hoá giá trị role (hỗ trợ cả string và array)
const normalizeRoleValue = (role) => {
    // Trường hợp BE trả về mảng role, ví dụ: ["customer", "business"]
    if (Array.isArray(role) && role.length > 0) {
        const primary = role[0];
        return typeof primary === "string"
            ? primary.trim().toLowerCase()
            : null;
    }

    // Trường hợp cũ: role là string
    if (typeof role === "string") {
        return role.trim().toLowerCase();
    }

    return null;
};

export const getUserRole = () => {
    const user = getCurrentUser();
    if (!user) return null;

    // Ưu tiên role từ object user trong payload
    if (user.user?.role) {
        const normalized = normalizeRoleValue(user.user.role);
        if (normalized) return normalized;
    }

    // Fallback: lấy từ accessToken (JWT)
    if (user.accessToken) {
        try {
            const tokenPayload = JSON.parse(atob(user.accessToken.split('.')[1]));
            const normalized = normalizeRoleValue(tokenPayload.role);
            if (normalized) return normalized;
        } catch (error) {
            console.error("Error decoding JWT token:", error);
            return null;
        }
    }

    return null;
};

// Get role from token only (for checking token state)
export const getTokenRole = () => {
    const user = getCurrentUser();
    if (!user || !user.accessToken) return null;
    
    try {
        const tokenPayload = JSON.parse(atob(user.accessToken.split('.')[1]));
        return normalizeRoleValue(tokenPayload.role);
    } catch (error) {
        console.error("Error decoding JWT token:", error);
        return null;
    }
};

export const getRedirectPath = (role) => {
    switch (role) {
        case "customer":
            return "/";
        case "business":
            return "/business";
        case "staff":
            return "/staff/online-borrow-orders";
        case "admin":
        case "administrator":
            return "/admin";
        default:
            return "/";
    }
}; 