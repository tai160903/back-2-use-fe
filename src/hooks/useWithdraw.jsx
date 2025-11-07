import { useState } from "react";
import toast from "react-hot-toast";
import { withdrawMoneyApi, getTransactionHistoryApi } from "../store/slices/walletSlice";
import { useDispatch } from "react-redux";
import { useUserInfo } from "./useUserInfo";
import { getProfileApi, getProfileBusiness } from "../store/slices/userSlice";
import { getUserRole } from "../utils/authUtils";

export default function useWithdraw() {
  const dispatch = useDispatch();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState(null);
  const { walletId, balance, isLoading: profileLoading } = useUserInfo();

  //   Logic withdraw money
  const handleWithdraw = async (e, walletId, onSuccess) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setWithdrawLoading(true);
    try {
      const response = await dispatch(
        withdrawMoneyApi({ walletId, amount: parseFloat(withdrawAmount) })
      ).unwrap();
      const role = getUserRole?.();
      if (role === "business") {
        await dispatch(getProfileBusiness());
      } else {
        await dispatch(getProfileApi());
      }
      await dispatch(
        getTransactionHistoryApi({ page: 1, limit: 3, typeGroup: "personal", direction: "all" })
      );
      toast.success("Withdraw request submitted successfully!");
      setWithdrawAmount("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setWithdrawError(err);
      toast.error(
        `Error: ${err?.message || "An error occurred while withdrawing"}`
      );
    } finally {
      setWithdrawLoading(false);
    }
  };

  const resetWithdraw = () => {
    setWithdrawAmount("");
    setWithdrawError(null);
  };

  return {
    withdrawAmount,
    setWithdrawAmount,
    handleWithdraw,
    withdrawLoading,
    withdrawError,
    resetWithdraw,
  };
}
