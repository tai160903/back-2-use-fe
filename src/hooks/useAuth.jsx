import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, isLoading, error } = useSelector((state) => state.auth);
  return { dispatch, currentUser, navigate, isLoading, error };
};

export default useAuth;
