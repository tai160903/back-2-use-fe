import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import "./ModalWallet.css";

export default function ModalWallet({
  open,
  handleClose,
  title,
  description,
  amount,
  setAmount,
  handleSubmit,
  action,
  loading = false,
  error = null,
  walletId,
  currency = "VND",
}) {
  const handleSelectAmount = (value) => {
    setAmount(value.toString());
  };

  const isValidAmount = amount && parseFloat(amount) >= 10000; 

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modalWallet">
        <div className="modalWallet-title">
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ marginBottom: "0px" }}
          >
            {title}
          </Typography>
          <span>{description}</span>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error.message || error}
            </Alert>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <TextField
            label={`Amount (${currency})`}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 10000, step: "1000" }}
            disabled={loading || !walletId}
            helperText={!walletId ? "Loading wallet information..." : "Minimum 10,000 VND"}
          />
          <Box sx={{ mt: 2, display: "flex", gap: 1, mb: 2 }}>
            {[10000, 50000, 100000].map((value) => (
              <Button
                key={value}
                variant="outlined"
                onClick={() => handleSelectAmount(value)}
                sx={{
                  border: "1px solid #e7e7e7",
                  color: "black",
                  minWidth: "60px",
                  "&:hover": { backgroundColor: "#54b7aa" },
                }}
              >
                {value} VND
              </Button>
            ))}
          </Box>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 2, py: 1.5, borderRadius: 1, textTransform: "none" }}
              disabled={!isValidAmount || loading || !walletId}
            >
              {`${action === "withdraw" ? "Withdraw: " : "Deposit: "} ${currency} ${amount || "0"}`}
            </Button>
          )}
        </form>
      </Box>
    </Modal>
  );
}