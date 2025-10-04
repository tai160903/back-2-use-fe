import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./RejectPopup.css";

const RejectPopup = ({ open, onClose, onReject, businessName }) => {
  const [rejectionReason, setRejectionReason] = React.useState("");

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      sx={{
        "& .MuiDialog-paper": {
          width: "800px",
          padding: "10px",
          borderRadius: "8px",
          maxWidth: "550px",
        },
      }}
    >
      <DialogContent>
        <Typography variant="h6" gutterBottom className="reject-popup-title">
          Reject Business Application
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Please provide a reason for rejecting {businessName}'s application.
          This will be sent to the business owner.
        </Typography>
        <TextField
          className="reject-textfield"
          autoFocus
          margin="dense"
          label="Rejection Reason"
          type="text"
          fullWidth
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Explain why this application is being rejected (e.g., incomplete documentation, licensing issues, etc.)..."
          variant="outlined"
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions className="reject-popup-actions">
        <Button onClick={onClose} className="reject-popup-cancel">
          Cancel
        </Button>
        <Button
          className="reject-popup-reject"
          onClick={handleReject}
          color="error"
          disabled={!rejectionReason.trim()}
        >
          Reject Application
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectPopup;
