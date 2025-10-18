import React from "react";
import "./DeleteConfirmModal.css";
import { IoClose, IoWarning } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

export default function DeleteConfirmModal({ 
  open, 
  onClose, 
  onConfirm, 
  itemName, 
  itemType = "subscription plan" 
}) {
  if (!open) return null;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div className="delete-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <div className="delete-modal-icon">
            <IoWarning />
          </div>
          <div className="delete-modal-title-section">
            <h2 className="delete-modal-title">Confirm Deletion</h2>
            <p className="delete-modal-subtitle">
              This action cannot be undone
            </p>
          </div>
          <button className="delete-modal-close-btn" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="delete-modal-content">
          <div className="delete-modal-message">
            <p>
              Are you sure you want to delete the <strong>"{itemName}"</strong> {itemType}?
            </p>
            <p className="delete-modal-warning">
              This will permanently remove the {itemType} and all associated data.
            </p>
          </div>
        </div>

        <div className="delete-modal-actions">
          <button 
            className="delete-modal-btn cancel-btn" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="delete-modal-btn confirm-btn" 
            onClick={onConfirm}
          >
            <MdDelete />
            Delete 
          </button>
        </div>
      </div>
    </div>
  );
}
