import Typography from "@mui/material/Typography";
import "./WalletCustomer.css";
import { LuWallet } from "react-icons/lu";

export default function WalletCustomer() {
  return (
    <>
      <div className="wallet">
        <div className="wallet-container">
          <div className="wallet-header">
            <div className="wallet-title">
              <Typography
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  fontSize: "30px",
                  fontWeight: "bold",
                }}
              >
                <LuWallet className="mr-2 text-black" /> Wallet Balance
              </Typography>
              <span style={{ color: "#787e7a" }}>
                Manage your deposits and payment methods
              </span>
            </div>
            <div className="wallet-balance">
              <div className="wallet-balance-des">
                <Typography
                  sx={{
                    fontSize: "40px",
                    color: "#007a00",
                    fontWeight: "bold",
                  }}
                >
                  $25.50
                </Typography>
                <span>Available Balance</span>
              </div>
              <div className="wallet-balance-transaction">Transaction</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
