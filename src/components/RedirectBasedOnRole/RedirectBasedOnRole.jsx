import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserRole, getRedirectPath, isAuthenticated } from "../../utils/authUtils";
import { PATH } from "../../routes/path";


export default function RedirectBasedOnRole() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.auth);
  const hasRedirected = useRef(false);

  useEffect(() => {

    if (hasRedirected.current) return;
    if (
      isAuthenticated() &&
      location.pathname === PATH.HOME &&
      !location.pathname.startsWith(PATH.AUTH)
    ) {
      const userRole = getUserRole();
      
      if (userRole) {
        const redirectPath = getRedirectPath(userRole);
        
        if (redirectPath && redirectPath !== PATH.HOME) {
          hasRedirected.current = true;
          navigate(redirectPath, { replace: true });
        }
      }
    }
  }, [currentUser, location.pathname, navigate]);

  useEffect(() => {
    if (!currentUser) {
      hasRedirected.current = false;
    }
  }, [currentUser]);

  return null;
}
