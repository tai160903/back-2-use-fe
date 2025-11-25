import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import { MdAccountBalance, MdPhoneIphone } from "react-icons/md";
import momoIcon from "../../assets/image/momo.jpg";
import vnpayIcon from "../../assets/image/channels4_profile.jpg";
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
  paymentMethod = "vnpay",
  setPaymentMethod,
}) {
  const handleSelectAmount = (value) => {
    setAmount(value.toString());
  };

  const isValidAmount = amount && parseFloat(amount) >= 10000;

  const handleSubmitWithAmount = (e) => {
    // Save deposit amount to localStorage before submit (for callbacks)
    if (action === "deposit" && amount) {
      localStorage.setItem("depositAmount", amount);
    }
    handleSubmit(e);
  }; 

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
        <form onSubmit={handleSubmitWithAmount}>
          {setPaymentMethod && (
            <Box sx={{ mt: 1, mb: 1.5 }}>
              <FormLabel component="legend" sx={{ fontSize: 14, mb: 1 }}>
                Select payment method
              </FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <Grid container spacing={1.5}>
                  <Grid item size={6}>
                    <FormControlLabel
                      value="vnpay"
                      control={<Radio size="small" />}
                      sx={{
                        width: "100%",
                        m: 0,
                        px: 1,
                        py: 0.75,
                        borderRadius: 2,
                        border:
                          paymentMethod === "vnpay"
                            ? "1px solid #1976d2"
                            : "1px solid #e0e0e0",
                        backgroundColor:
                          paymentMethod === "vnpay" ? "#e3f2fd" : "#fafafa",
                      }}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 26,
                              height: 26,
                              borderRadius: "8px",
                              backgroundColor: "#1976d2",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                            }}
                          >
                            <img src={vnpayIcon} alt="VNPay" width={16} height={16} />
                          </Box>
                          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                            VNPay
                          </Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item size={6}>
                    <FormControlLabel
                      value="momo"
                      control={<Radio size="small" />}
                      sx={{
                        width: "100%",
                        m: 0,
                        px: 1,
                        py: 0.75,
                        borderRadius: 2,
                        border:
                          paymentMethod === "momo"
                            ? "1px solid #d81b60"
                            : "1px solid #e0e0e0",
                        backgroundColor:
                          paymentMethod === "momo" ? "#fce4ec" : "#fafafa",
                      }}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 26,
                              height: 26,
                              borderRadius: "8px",
                              backgroundColor: "#d81b60",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                            }}
                          >
                            <img src={momoIcon} alt="MoMo" width={16} height={16} />
                          </Box>
                          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                            MoMo
                          </Typography>
                        </Box>
                      }
                    />
                  </Grid>
                </Grid>
              </RadioGroup>
            </Box>
          )}
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
            helperText={
              !walletId ? "Loading wallet information..." : "Minimum 10,000 VND"
            }
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
                {value.toLocaleString('vi-VN')} VND
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
              {`${
                action === "withdraw" ? "Withdraw: " : "Deposit: "
              } ${amount ? parseFloat(amount).toLocaleString("vi-VN") : "0"} VND`}
            </Button>
          )}
        </form>
      </Box>
    </Modal>
  );
}