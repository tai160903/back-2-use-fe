import React, { useEffect, useState } from "react";
import "./Subscriptions.css";
import { 
  MdAttachMoney, 
  MdCalendarToday, 
  MdDescription, 
  MdPayment, 
  MdDateRange, 
  MdEdit, 
  MdDelete,
  MdAdd,
} from "react-icons/md";

import { IoIosSearch } from "react-icons/io";
import { 
  BiLayer 
} from "react-icons/bi";
import ModalSubscriptions from "../../../components/ModalSubscriptions/ModalSubscriptions";
import { useDispatch, useSelector } from "react-redux";
import { getALLSubscriptions } from "../../../store/slices/subscriptionSlice";

export default function Subscriptions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalMode, setModalMode] = useState("view"); 
  const dispatch = useDispatch();
  const { subscription } = useSelector(state => state.subscription);

const dataSubscriptions = subscription.data;

  useEffect(() => {
    dispatch(getALLSubscriptions());
  }, [dispatch]);

  const handleActionClick = (item) => {
    setSelectedItem(item);
    setModalMode("view");
    setOpenPopup(true);
  };

  const handleCreateClick = () => {
    setSelectedItem(null);
    setModalMode("create");
    setOpenPopup(true);
  };


  // edit subscription
  const handleEditClick = (item) => {
    setSelectedItem(item);
    setModalMode("edit");
    setOpenPopup(true);
  };

  // const handleDeleteClick = (item) => {
  //   if (window.confirm(`Bạn có chắc chắn muốn xóa subscription "${item.name}"?`)) {
  //     console.log('Delete subscription:', item);
  //     // TODO: Implement delete logic
  //   }
  // };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedItem(null);
    setModalMode("view");
  };

  const renderSubscriptionIcon = () => (
    <BiLayer 
      size={32}
      className="subscriptions-title-icon"
    />
  );

  const renderEmptyState = () => (
    <div className="subscriptions-empty">
      <BiLayer 
        size={64}
        className="subscriptions-empty-icon"
      />
      <h3 className="subscriptions-empty-title">No subscriptions found</h3>
      <p className="subscriptions-empty-description">
        {!searchTerm 
          ? 'No subscription plans available at the moment.'
          : `No subscriptions found matching "${searchTerm}". Try changing the search term.`
        }
      </p>
    </div>
  );


  return (
    <div className="subscriptions-management">
      {/* Header Section */}
      <div className="subscriptions-header">
        <div className="subscriptions-title-section">
          {renderSubscriptionIcon()}
          <div>
            <h1 className="subscriptions-title">Subscription Management</h1>
            <p className="subscriptions-description">
              Manage business subscription plans and billing
            </p>
          </div>
        </div>
        <button className="create-btn" onClick={handleCreateClick}>
          <MdAdd size={20} />
          Create Subscription
        </button>
      </div>


      {/* Search Section */}
      <div className="subscriptions-filters">
        <div className="search-container">
          <IoIosSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Subscription Name or Features"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Subscription Cards */}
      {dataSubscriptions?.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="subscriptions-grid">
          {dataSubscriptions?.map((item) => (
            <div key={item._id} className="subscriptions-card">
              <div className="subscriptions-card-header">
                <div className="subscriptions-card-info">
                  <div className="subscriptions-card-icon">
                    <MdPayment />
                  </div>
                  <div>
                    <h3 className="subscriptions-card-title">{item.name}</h3>
                    <p className="subscriptions-card-subtitle">
                      {item.isTrial ? 'Trial Plan' : 'Subscription Plan'}
                    </p>
                  </div>
                </div>
                <div className="action-buttons-row">
                  <button 
                    className="action-btn-icon edit-btn"
                    onClick={() => handleEditClick(item)}
                    title="Edit"
                  >
                    <MdEdit />
                  </button>
                  {/* <button 
                    className="action-btn-icon delete-btn"
                    onClick={() => handleDeleteClick(item)}
                    title="Delete"
                  >
                    <MdDelete />
                  </button> */}
                </div>
              </div>
              
              <div className="subscriptions-card-details">
                <div className="subscriptions-detail-item">
                  <span className="subscriptions-detail-label">
                    <MdAttachMoney />
                    Price
                  </span>
                  <span className="subscriptions-detail-value">
                    {item.price === 0 ? 'Free' : `${item.price.toLocaleString()} VND`}
                  </span>
                </div>
                <div className="subscriptions-detail-item">
                  <span className="subscriptions-detail-label">
                    <MdCalendarToday />
                    Duration
                  </span>
                  <span className="subscriptions-detail-value">{item.durationInDays} days</span>
                </div>
                <div className="subscriptions-detail-item">
                  <span className="subscriptions-detail-label">
                    <MdDescription />
                    Features
                  </span>
                  <span className="subscriptions-detail-value">{item.description.length} features</span>
                </div>
                <div className="subscriptions-detail-item">
                  <span className="subscriptions-detail-label">
                    Status
                  </span>
                  <span className={`status-badge ${item.isActive ? 'status-active' : 'status-cancelled'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="subscriptions-detail-item">
                  <span className="subscriptions-detail-label">
                    <MdDateRange />
                    Created
                  </span>
                  <span className="subscriptions-detail-value">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="subscriptions-card-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => handleActionClick(item)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalSubscriptions
        open={openPopup}
        onClose={handleClosePopup}
        selectedItem={selectedItem}
        mode={modalMode}
      />
    </div>
  );
}
