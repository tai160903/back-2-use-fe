import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { login } from "../../../store/slices/authSlice";  

export default function GoogleCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");  
    const error = params.get("error");

    if (error) {
      toast.error("Google Sign In Failed: " + decodeURIComponent(error));
      navigate("/auth/login", { replace: true });
      return;
    }

    if (token) {
      try {
        const userData = JSON.parse(decodeURIComponent(token));  
        dispatch(login(userData));  
        localStorage.setItem("currentUser", JSON.stringify(userData));

      } catch (error) {
        toast.error("Invalid user data.");
        navigate("/auth/login", { replace: true });
      }
    } else {
      toast.error("Not receiving token from Google login.");
      navigate("/auth/login", { replace: true });
    }
  }, [dispatch, navigate]);

  return <div>Processing Google login...</div>;
}