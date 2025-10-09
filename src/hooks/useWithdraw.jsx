
import { useState } from "react";
import toast from "react-hot-toast";

export default function useWithdraw() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState(null);



//   Logic withdraw money
  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setWithdrawLoading(true);
    try {
      console.log("Withdrawing funds:", withdrawAmount);
      // TODO: Gọi API rút tiền thật ở đây (ví dụ: dispatch(withdrawMoneyApi({ amount: parseFloat(withdrawAmount) })).unwrap();)
      toast.success("Withdraw request submitted successfully!");
      setWithdrawAmount("");
    } catch (err) {
      setWithdrawError(err);
      toast.error(`Error: ${err?.message || "An error occurred while withdrawing"}`);
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