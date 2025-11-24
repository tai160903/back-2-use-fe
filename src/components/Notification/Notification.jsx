"use client";

import { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import { formatDistanceToNow, parseISO } from "date-fns";
import "./Notification.css";

export default function Notification({
  userId,
  initialNotifications = [],
  socket = null,
  // role hiện tại của user: "customer" | "business"
  mode = "customer",
}) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (Array.isArray(initialNotifications)) {
      const mapped = initialNotifications.map((n) => ({
        id: n._id || n.id,
        title: n.title || "",
        body: n.message || n.body || "",
        createdAt: n.createdAt || new Date().toISOString(),
        read: n.isRead ?? n.read ?? false,
      }));
      setNotifications(mapped);
    }
  }, [initialNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleOpen = () => setOpen((v) => !v);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      socket?.emit?.("markAsRead", id);
    } catch (err) {
      console.warn("markAsRead emit failed", err);
    }
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      // gửi kèm mode để BE chỉ đánh dấu đã đọc cho đúng role
      socket?.emit?.("markAllAsRead", { userId, mode });
    } catch (err) {
      console.warn("markAllAsRead emit failed", err);
    }
  };

  const removeAllNotifications = () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove all notifications?"
    );
    if (!confirmed) return;
    setNotifications([]);
    try {
      // dùng đúng mode hiện tại thay vì fix cứng "customer"
      socket?.emit?.("deleteAllNotifications", { userId, mode });
    } catch (err) {
      console.warn("deleteAllNotifications emit failed", err);
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      socket?.emit?.("deleteNotification", id);
    } catch (err) {
      console.warn("deleteNotification emit failed", err);
    }
  };

  const markAsUnread = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
    try {
      socket?.emit?.("markAsUnread", id);
    } catch (err) {
      console.warn("markAsUnread emit failed", err);
    }
  };

  return (
    <div className="wrapper" ref={wrapperRef}>
      <IconButton onClick={toggleOpen} size="large" aria-label="notifications">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {open && (
        <div className="dropdown">
          <div className="header">
            <strong>Notifications</strong>
            <div className="actions">
              <button className="actionBtn" onClick={markAllRead}>
                Mark all
              </button>
              <button className="actionBtn" onClick={removeAllNotifications}>
                Remove all
              </button>
              <button
                className="closeBtn"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>
          </div>
          <div className="list">
            {notifications.length === 0 && (
              <div className="empty">No notifications</div>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`item ${n.read ? "read" : "unread"}`}
                onClick={() => markAsRead(n.id)}
              >
                <div className="itemMain">
                  <div className="itemTitle">{n.title}</div>
                  <div className="itemTime">
                    {formatDistanceToNow(parseISO(n.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div className="itemBody">{n.body}</div>
                <div className="itemControls">
                  {n.read && (
                    <button
                      className="actionBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsUnread(n.id);
                      }}
                    >
                      Mark unread
                    </button>
                  )}
                  <button
                    className="removeBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(n.id);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
