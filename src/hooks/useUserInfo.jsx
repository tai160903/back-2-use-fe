import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileApi, getProfileBusiness } from "../store/slices/userSlice";
import { getUserRole } from "../utils/authUtils";

export const useUserInfo = () => {
  const dispatch = useDispatch();
  const { userInfo, businessInfo, isLoading, error } = useSelector((state) => state.user);
  const role = getUserRole();

  useEffect(() => {
    if (role === "business") {
      if (!businessInfo) {
        dispatch(getProfileBusiness());
      }
    } else {
      if (!userInfo) {
        dispatch(getProfileApi());
      }
    }
  }, [dispatch, role, userInfo, businessInfo]);

  const walletId = role === "business"
    ? (businessInfo?.data?.wallet?._id || null)
    : (userInfo?.wallet?._id || null);

  const balance = role === "business"
    ? (businessInfo?.data?.wallet?.availableBalance || 0)
    : (userInfo?.wallet?.availableBalance || 0);

  const availableBalance = role === "business"
    ? (businessInfo?.data?.wallet?.availableBalance || 0)
    : (userInfo?.wallet?.availableBalance || 0);

  const holdingBalance = role === "business"
    ? (businessInfo?.data?.wallet?.holdingBalance || 0)
    : (userInfo?.wallet?.holdingBalance || 0);

  return {
    walletId,
    balance,
    isLoading,
    error,
    userInfo,
    businessInfo,
    availableBalance,
    holdingBalance,
    refetch: () => role === "business" ? dispatch(getProfileBusiness()) : dispatch(getProfileApi()),
  };
};
