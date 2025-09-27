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

export const getUserRole = () => {
    const user = getCurrentUser();
    return user?.user?.role?.trim().toLowerCase();
};

export const getRedirectPath = (role) => {
    switch (role) {
        case "customer":
            return "/";
        case "bussiness":
            return "/business";
        case "admin":
            return "/admin";
        default:
            return "/";
    }
}; 