import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { TiClipboard } from "react-icons/ti";
import { IoMdPerson } from "react-icons/io";
import { LuClipboardList } from "react-icons/lu";
import { BiMessageSquareX } from "react-icons/bi";
import { SiTicktick } from "react-icons/si";

import "./ModalRegistration.css";
import RejectPopup from "../RejectPopup/RejectPopup";

const ModalRegistration = ({ open, onClose, selectedItem }) => {
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);

  const handleRejectClick = () => {
    setIsRejectPopupOpen(true);
  };

  const handleRejectPopupClose = () => {
    setIsRejectPopupOpen(false);
  };

  const handleRejectApplication = () => {
    // Logic xử lý từ chối ứng dụng (ở đây chỉ đóng popup)
    setIsRejectPopupOpen(false);
    // Có thể thêm logic gửi yêu cầu từ chối ở đây
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      sx={{
        "& .MuiDialog-paper": {
          width: "550px",
          maxWidth: "90vw",
          overflow: "hidden",
        },
      }}
    >
      <Box className="popup-header">
        <Typography className="popup-title">
          {selectedItem?.name.charAt(0)}
        </Typography>
        <Typography className="popup-name">{selectedItem?.name}</Typography>
        <Typography className="popup-status">{selectedItem?.status}</Typography>
      </Box>
      <Box className="popup-des">
        <Typography>
          Review all registration details and approve or reject this business
          application.
        </Typography>
      </Box>
      <DialogContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box className="info-section">
            <Typography variant="h6" className="popUp-info-title">
              <TiClipboard className="mr-2 size-6" /> Business Information
            </Typography>
            <div style={{ border: "1px solid #ccc", marginTop: "8px" }}></div>
            <Typography className="popUp-info">
              <strong className="popUp-info-span">Business Name</strong>{" "}
              {selectedItem?.name}
            </Typography>
            <Typography className="popUp-info ">
              <strong>Business Type</strong> {selectedItem?.type}
            </Typography>
            <Typography className="popUp-info">
              <strong>Address</strong> {selectedItem?.address || "N/A"}
            </Typography>
            <Typography className="popUp-info">
              <strong>Tax ID</strong> {selectedItem?.taxId || "N/A"}
            </Typography>
            <Typography className="popUp-info">
              <strong>Description</strong> {selectedItem?.description || "N/A"}
            </Typography>
          </Box>
          <Box className="info-section">
            <Typography variant="h6" className="popUp-info-title">
              <IoMdPerson className="mr-2 size-6" /> Contact Information
            </Typography>
            <div style={{ border: "1px solid #ccc", marginTop: "8px" }}></div>
            <Typography className="popUp-info">
              <strong>Contact Person</strong>{" "}
              {selectedItem?.contactPerson || "N/A"}
            </Typography>
            <Typography className="popUp-info">
              <strong>Email</strong> {selectedItem?.email || "N/A"}
            </Typography>
            <Typography className="popUp-info">
              <strong>Phone</strong> {selectedItem?.phone}
            </Typography>
            <Typography className="popUp-info">
              <strong>Application Date</strong> {selectedItem?.appliedDate}
            </Typography>
          </Box>
        </Box>
        <div style={{ border: "1px solid #ccc", marginTop: "8px" }}></div>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" className="popUp-info-title">
            <LuClipboardList className="mr-2 size-5" /> Business Documents
          </Typography>
          <div className="info-section-documents">
            <Typography className="popUp-info-documents">
              <strong>Business License</strong>{" "}
              <a
                href={selectedItem?.businessLicense}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedItem?.businessLicense}
              </a>
            </Typography>
            <Typography className="popUp-info-documents">
              <strong>Food Safety Certificate:</strong>{" "}
              <a
                href={selectedItem?.foodSafetyCertificate}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedItem?.foodSafetyCertificate}
              </a>
            </Typography>
          </div>
        </Box>
        <div style={{ border: "1px solid #ccc", marginTop: "8px" }}></div>
      </DialogContent>

      <DialogActions>
        <div className="popup-actions">
          <Button onClick={handleRejectClick} className="popup-button-reject">
            <BiMessageSquareX className="mr-3 size-4" /> Reject Application
          </Button>
          <Button onClick={onClose} className="popup-button-approve">
            <SiTicktick className="mr-3 size-4" /> Approve Application
          </Button>
        </div>
      </DialogActions>

      {/* Popup từ chối */}
      <RejectPopup
        open={isRejectPopupOpen}
        onClose={handleRejectPopupClose}
        onReject={handleRejectApplication}
        businessName={selectedItem?.name}
      />
    </Dialog>
  );
};

export default ModalRegistration;
