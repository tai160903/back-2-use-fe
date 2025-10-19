import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileApi } from "../store/slices/userSlice";

export const useUserInfo = () => {
  const dispatch = useDispatch();
  const { userInfo, isLoading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userInfo || userInfo.length === 0) {
      dispatch(getProfileApi());
    }
  }, [dispatch, userInfo]);

  const walletId = userInfo?.wallet?._id || null;
  const balance = userInfo?.wallet?.balance || 0;

  return {
    walletId,
    balance,
    isLoading,
    error,
    refetch: () => dispatch(getProfileApi()),
  };
};
