// useDeposit.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";
import { clearDepositResult, depositeMoneyApi } from "../store/slices/walletSlice";

export default function useDeposit(walletId) {
  const dispatch = useDispatch();
  const {
    isLoading: depositLoading,
    depositResult,
    error: depositError,
  } = useSelector((state) => state.wallet);

  const [addAmount, setAddAmount] = useState("");


//   function deposit money
  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!addAmount || parseFloat(addAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!walletId) {
      toast.error("Wallet not found. Please refresh the page.");
      return;
    }
    try {
      await dispatch(
        depositeMoneyApi({
          walletId,
          amount: parseFloat(addAmount),
        })
      ).unwrap();
      setAddAmount("");
      toast.success("Continue payment");
    } catch (err) {
      toast.error(`Error: ${err?.message || "An error occurred while depositing"}`);
    }
  };



  useEffect(() => {
    if (depositResult && depositResult.vnpayUrl) {
      console.log("Redirecting to VNPay URL:", depositResult.vnpayUrl);
      // Lưu thông tin giao dịch pending
      localStorage.setItem(
        "pendingDeposit",
        JSON.stringify({
          walletId,
          amount: addAmount,
          orderId: depositResult.orderId || Date.now().toString(),
        })
      );

      // Redirect đến VNPay
      window.location.href = depositResult.vnpayUrl;
    }
  }, [depositResult, walletId, addAmount]);

  const resetDeposit = () => {
    setAddAmount("");
    dispatch(clearDepositResult());
  };

  return {
    addAmount,
    setAddAmount,
    handleDeposit,
    depositLoading,
    depositError,
    depositResult,
    resetDeposit,
  };
}