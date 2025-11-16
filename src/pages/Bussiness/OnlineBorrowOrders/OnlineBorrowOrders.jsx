import React, { useEffect, useMemo, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { FiBox } from "react-icons/fi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { MdOutlineCheckCircle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmBorrowTransactionBusinessApi,
  getDetailPendingBorrowTransactionBusinessApi,
  getPendingBorrowTransactionsBusinessApi,
} from "../../../store/slices/borrowSlice";
import "./OnlineBorrowOrders.css";

export default function OnlineBorrowOrders() {
  const dispatch = useDispatch();
  const { borrow: pendingTransactions, borrowDetail, isDetailLoading } =
    useSelector((state) => state.borrow);

  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getPendingBorrowTransactionsBusinessApi());
  }, [dispatch]);

  const mapBackendStatusToUI = (transactionStatus) => {
    if (transactionStatus === "pending_pickup") return "pending";
    if (transactionStatus === "borrowed" || transactionStatus === "completed")
      return "approved";
    if (transactionStatus === "cancelled" || transactionStatus === "rejected")
      return "rejected";
    return "pending";
  };

  useEffect(() => {
    if (Array.isArray(pendingTransactions)) {
      const mappedOrders = pendingTransactions.map((transaction) => ({
        orderId: transaction._id,
        customerName: transaction.customerId?.userId?.email || "Customer",
        productName:
          transaction.productId?.productGroupId?.name ||
          transaction.productId?.productGroupId?.materialId?.materialName ||
          "Product",
        quantity: 1,
        createdAt: transaction.createdAt,
        expectedPickupTime: transaction.borrowDate || transaction.dueDate,
        status: mapBackendStatusToUI(transaction.status),
      }));
      setOrders(mappedOrders);
    }
  }, [pendingTransactions]);

  const handleConfirm = (orderId) => {
    // Gọi API confirm trên backend
    dispatch(confirmBorrowTransactionBusinessApi(orderId));

    // Cập nhật optimistic UI cho danh sách đơn
    setOrders((previousOrders) =>
      previousOrders.map((orderItem) =>
        orderItem.orderId === orderId
          ? { ...orderItem, status: "approved" }
          : orderItem
      )
    );
  };

  const handleOpenDetails = (orderId) => {
    setIsDetailModalOpen(true);
    dispatch(getDetailPendingBorrowTransactionBusinessApi(orderId));
  };

  const handleCloseDetails = () => {
    setIsDetailModalOpen(false);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((orderItem) => {
      if (!searchTerm) return true;
      const keyword = searchTerm.toLowerCase();
      return (
        orderItem.customerName.toLowerCase().includes(keyword) ||
        orderItem.productName.toLowerCase().includes(keyword)
      );
    });
  }, [orders, searchTerm]);

  const getStatusInfo = (status) => {
    if (status === "approved") {
      return { statusText: "Approved", statusClass: "active" };
    }
    if (status === "rejected") {
      return { statusText: "Rejected", statusClass: "blocked" };
    }
    return { statusText: "Pending", statusClass: "pending" };
  };

  return (
    <div className="online-orders-page">
      {/* Header */}
      <div className="online-orders-header">
        <div className="online-orders-title-section">
          <FiBox className="online-orders-title-icon" />
          <div>
            <h1 className="online-orders-title">Online Borrow Orders</h1>
            <p className="online-orders-description">
              Manage online borrow orders and confirm at the counter
            </p>
          </div>
        </div>
      </div>

      {/* Search + Filter Tabs */}
      <div className="online-orders-filters">
        <div className="search-container">
          <IoIosSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by customer or product..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Table header */}
      <div className="online-orders-table-header">
        <div className="online-orders-header-cell">Customer</div>
        <div className="online-orders-header-cell">Product</div>
        <div className="online-orders-header-cell">Quantity</div>
        <div className="online-orders-header-cell">Created at</div>
        <div className="online-orders-header-cell">Expected pickup time</div>
        <div className="online-orders-header-cell">Status</div>
        <div className="online-orders-header-cell">Actions</div>
      </div>

      {/* Rows */}
      {filteredOrders.length === 0 ? (
        <div className="online-orders-empty">No orders match your filters.</div>
      ) : (
        <div className="online-orders-cards">
          {filteredOrders.map((order) => {
            const { statusText, statusClass } = getStatusInfo(order.status);
            return (
              <div
                key={order.orderId}
                className="online-order-card"
                onClick={() => handleOpenDetails(order.orderId)}
              >
                <div className="online-order-card-cell">
                  <div className="online-order-customer">
                    {order.customerName}
                  </div>
                </div>

                <div className="online-order-card-cell">
                  <div className="online-order-product">
                    {order.productName}
                  </div>
                </div>

                <div className="online-order-card-cell">
                  <div className="online-order-quantity">{order.quantity}</div>
                </div>

                <div className="online-order-card-cell">
                  <div className="online-order-time">
                    <RiCalendarScheduleLine className="online-order-time-icon" />
                    <span>{order.createdAt}</span>
                  </div>
                </div>

                <div className="online-order-card-cell">
                  <div className="online-order-time">
                    <RiCalendarScheduleLine className="online-order-time-icon" />
                    <span>{order.expectedPickupTime}</span>
                  </div>
                </div>

                <div className="online-order-card-cell">
                  <div className={`status-indicator ${statusClass}`}>
                    <div className={`status-dot ${statusClass}`}></div>
                    <span className="status-text">{statusText}</span>
                  </div>
                </div>

                <div className="online-order-card-cell">
                  <button
                    className={`online-order-confirm-btn ${
                      order.status === "approved" ? "confirmed" : ""
                    }`}
                    disabled={order.status === "approved"}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (order.status !== "approved") {
                        handleConfirm(order.orderId);
                      }
                    }}
                  >
                    <MdOutlineCheckCircle className="confirm-icon" />
                    <span>
                      {order.status === "approved"
                        ? "Borrow confirmed"
                        : "Confirm borrow"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {isDetailModalOpen && (
        <div
          className="borrow-detail-modal-backdrop"
          onClick={handleCloseDetails}
        >
          <div
            className="borrow-detail-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="borrow-detail-modal-header">
              <h2>Borrow Order Detail</h2>
              <button
                className="borrow-detail-close-btn"
                onClick={handleCloseDetails}
              >
                ×
              </button>
            </div>
            {isDetailLoading || !borrowDetail ? (
              <div className="borrow-detail-loading">Loading details...</div>
            ) : (
              <div className="borrow-detail-content">
                <div className="borrow-detail-section">
                  <h3>Product information</h3>
                  <p>
                    <span className="borrow-detail-label">Product group:</span>{" "}
                    {borrowDetail.productId?.productGroupId?.name}
                  </p>
                  <p>
                    <span className="borrow-detail-label">Material:</span>{" "}
                    {
                      borrowDetail.productId?.productGroupId?.materialId
                        ?.materialName
                    }
                  </p>
                  <p>
                    <span className="borrow-detail-label">Size:</span>{" "}
                    {borrowDetail.productId?.productSizeId?.sizeName}
                  </p>
                  <p>
                    <span className="borrow-detail-label">Serial:</span>{" "}
                    {borrowDetail.productId?.serialNumber}
                  </p>
                  {borrowDetail.productId?.productGroupId?.imageUrl && (
                    <div className="borrow-detail-image-wrapper">
                      <img
                        src={borrowDetail.productId.productGroupId.imageUrl}
                        alt="Product"
                        className="borrow-detail-product-image"
                      />
                    </div>
                  )}
                </div>

                <div className="borrow-detail-section">
                  <h3>Transaction details</h3>
                  <p>
                    <span className="borrow-detail-label">Transaction ID:</span>{" "}
                    {borrowDetail._id}
                  </p>
                  <p>
                    <span className="borrow-detail-label">
                      Transaction type:
                    </span>{" "}
                    {borrowDetail.borrowTransactionType}
                  </p>
                  <p>
                    <span className="borrow-detail-label">Borrow date:</span>{" "}
                    {borrowDetail.borrowDate &&
                      new Date(
                        borrowDetail.borrowDate
                      ).toLocaleString()}
                  </p>
                  <p>
                    <span className="borrow-detail-label">Due date:</span>{" "}
                    {borrowDetail.dueDate &&
                      new Date(
                        borrowDetail.dueDate
                      ).toLocaleString()}
                  </p>
                  <p>
                    <span className="borrow-detail-label">
                      Deposit amount:
                    </span>{" "}
                    {borrowDetail.depositAmount?.toLocaleString("vi-VN")} VND
                  </p>
                  <p>
                    <span className="borrow-detail-label">Status:</span>{" "}
                    {borrowDetail.status}
                  </p>
                </div>

                <div className="borrow-detail-footer">
                  <button
                    className={`borrow-detail-confirm-btn ${
                      mapBackendStatusToUI(borrowDetail.status) === "approved"
                        ? "confirmed"
                        : ""
                    }`}
                    disabled={
                      mapBackendStatusToUI(borrowDetail.status) === "approved"
                    }
                    onClick={() => {
                      if (
                        mapBackendStatusToUI(borrowDetail.status) !==
                        "approved"
                      ) {
                        handleConfirm(borrowDetail._id);
                        handleCloseDetails();
                      }
                    }}
                  >
                    <MdOutlineCheckCircle className="confirm-icon" />
                    <span>
                      {mapBackendStatusToUI(borrowDetail.status) === "approved"
                        ? "Borrow confirmed"
                        : "Confirm borrow"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}