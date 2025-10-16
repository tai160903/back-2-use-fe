import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./RejectPopup.css";

// Schema validation with Yup
const rejectSchema = yup.object({
  note: yup
    .string()
    .required("Rejection reason is required")
    .min(10, "Rejection reason must be at least 10 characters")
    .max(500, "Rejection reason cannot exceed 500 characters")
    .trim()
});

const RejectPopup = ({ open, onClose, onReject, businessName }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(rejectSchema),
    defaultValues: {
      note: ""
    }
  });

  const noteValue = watch("note");

  const onSubmit = async (data) => {
    try {
      // Send data with note field as in API documentation
      await onReject({
        note: data.note.trim()
      });
      reset();
    } catch (error) {
      console.error("Error rejecting business application:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Typography variant="h6" gutterBottom className="reject-popup-title">
            Reject Business Application
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Please provide a reason for rejecting {businessName}'s application.
            This reason will be sent to the business owner.
          </Typography>
          <TextField
            {...register("note")}
            className="reject-textfield"
            autoFocus
            margin="dense"
            label="Rejection Reason"
            type="text"
            fullWidth
            placeholder="Explain why this application is being rejected (e.g., incomplete documentation, licensing issues, etc.)..."
            variant="outlined"
            multiline
            rows={4}
            error={!!errors.note}
            helperText={errors.note?.message}
          />
          {noteValue && (
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
              Length: {noteValue.length}/500 characters
            </Typography>
          )}
        </DialogContent>
        <DialogActions className="reject-popup-actions">
          <Button onClick={handleClose} className="reject-popup-cancel">
            Cancel
          </Button>
          <Button
            type="submit"
            className="reject-popup-reject"
            color="error"
            disabled={isSubmitting || !noteValue?.trim()}
          >
            {isSubmitting ? "Processing..." : "Reject Application"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RejectPopup;
