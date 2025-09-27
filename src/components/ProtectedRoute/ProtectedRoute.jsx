import { Navigate } from "react-router-dom";
import { PATH } from "../../routes/path";
import { memo } from "react";
import { getCurrentUser, isAuthenticated, getUserRole, getRedirectPath } from "../../utils/authUtils";

const ProtectedRoute = memo(({ children, allowedRoles, allowAnonymous }) => {
  const currentUser = getCurrentUser();


  if (allowAnonymous) {
    if (isAuthenticated()) {
      const userRole = getUserRole();
      const redirectPath = getRedirectPath(userRole);
      return <Navigate to={redirectPath} replace />;
    }

    return children;
  }

  if (!isAuthenticated()) {
    return <Navigate to={PATH.LOGIN} replace />;
  }

  const userRole = getUserRole();
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const redirectPath = getRedirectPath(userRole);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
