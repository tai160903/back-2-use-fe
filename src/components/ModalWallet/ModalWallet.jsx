import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
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
}) {
  const handleSelectAmount = (value) => {
    setAmount(value);
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
        </div>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Amount ($)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0, step: "0.01" }}
          />
          <Box sx={{ mt: 2, display: "flex", gap: 1, mb: 2 }}>
            {[10, 25, 50].map((value) => (
              <Button
                key={value}
                variant="outlined"
                onClick={() => handleSelectAmount(value.toString())}
                sx={{
                  border: "1px solid #e7e7e7",
                  color: "black",
                  minWidth: "60px",
                  "&:hover": { backgroundColor: "#54b7aa" },
                }}
              >
                ${value}
              </Button>
            ))}
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2, py: 1.5, borderRadius: 1, textTransform: "none" }}
          >
            {`${action === "withdraw" ? "Withdraw: " : "Add: "} $${
              amount || "0.00"
            }`}
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
