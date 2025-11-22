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
    if (!user) return null;
    
    // Nếu role có trong user object
    if (user.user?.role) {
        return user.user.role.trim().toLowerCase();
    }
    
    if (user.accessToken) {
        try {
            const tokenPayload = JSON.parse(atob(user.accessToken.split('.')[1]));
            return tokenPayload.role?.trim().toLowerCase();
        } catch (error) {
            console.error("Error decoding JWT token:", error);
            return null;
        }
    }
    
    return null;
};

export const getRedirectPath = (role) => {
    switch (role) {
        case "customer":
            return "/";
        case "business":
            return "/business";
        case "admin":
        case "administrator":
            return "/admin";
        default:
            return "/";
    }
}; 