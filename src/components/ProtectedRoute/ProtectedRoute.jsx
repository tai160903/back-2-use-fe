import { Navigate } from "react-router-dom";
import { PATH } from "../../routes/path";
import { memo } from "react";
import { useSelector } from "react-redux";
import { getCurrentUser, isAuthenticated, getUserRole, getRedirectPath } from "../../utils/authUtils";

const ProtectedRoute = memo(({ children, allowedRoles, allowAnonymous }) => {
  // Subscribe vào Redux store để re-render khi currentUser thay đổi
  const currentUserFromStore = useSelector((state) => state.auth.currentUser);
  const currentUser = getCurrentUser();


  if (allowAnonymous) {
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