import { useState } from "react";
import Profile from "../../Home/Profile/Profile";
import TransactionHistory from "../../Home/TransactionHistory/TransactionHistory";
import WalletHistoryOnly from "../WalletHistoryOnly/WalletHistoryOnly";
import "../BusinessTransaction/BusinessTransaction.css";

export default function CustomerLegacyData() {
  const [tab, setTab] = useState("profile");

  return (
    <div className="business-transaction-page">
      <div className="transactions-section">
        <div className="transaction-header">
          <div className="transaction-title-section">
            <h2 className="transaction-title">Previous Customer Data</h2>
          </div>
          <p className="transaction-description">View profile, borrow/return history, and wallet deposits/withdrawals from when you were a customer.</p>
        </div>

        <div className="transaction-filters" style={{ marginBottom: 20 }}>
          <div className="filter-tabs">
            <button className={`filter-tab ${tab === "profile" ? "active" : ""}`} onClick={() => setTab("profile")}>Profile</button>
            <button className={`filter-tab ${tab === "borrow" ? "active" : ""}`} onClick={() => setTab("borrow")}>Borrow/Return</button>
            <button className={`filter-tab ${tab === "wallet" ? "active" : ""}`} onClick={() => setTab("wallet")}>Deposits/Withdrawals</button>
          </div>
        </div>

        {tab === "profile" && (
          <div style={{ background: "#fff", borderRadius: 16 }}>
            <Profile readOnly={true} />
          </div>
        )}

        {tab === "borrow" && (
          <div style={{ background: "#fff", borderRadius: 16 }}>
            <TransactionHistory />
          </div>
        )}

        {tab === "wallet" && (
          <div style={{ background: "#fff", borderRadius: 16 }}>
            <WalletHistoryOnly />
          </div>
        )}
      </div>
    </div>
  );
}


