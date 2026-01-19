
// src/components/NotificationProvider/NotificationProvider.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setUnreadCount,
  incrementUnread,
} from "../../store/slices/notificationSlice";
import {
  connectSocket,
  disconnectSocket,
  onNotification,
  offNotification,
} from "../../utils/socket";
import api from "../../apis/fetcher";
import { getUserRole } from "../../utils/authUtils";

export default function NotificationProvider({ children }) {
  const dispatch = useDispatch();
  // Dữ liệu user thực tế đang được lưu ở state.auth.currentUser
  const authUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
   

    const userId =
      authUser?.user?._id || authUser?.user?._uid || authUser?._id || null;
    if (!userId) {
    
      return;
    }

    // Hàm chuẩn hoá role (hỗ trợ string hoặc array)
    const normalizeRole = (role) => {
      if (Array.isArray(role) && role.length > 0) {
        const primary = role[0];
        return typeof primary === "string"
          ? primary.toLowerCase()
          : null;
      }
      if (typeof role === "string") {
        return role.toLowerCase();
      }
      return null;
    };

    const rawRole =
      getUserRole() || authUser?.user?.role || authUser?.role;
    const normalizedRole = normalizeRole(rawRole);
    const mode = normalizedRole || "customer";

  
    connectSocket(userId, mode);

    // Lấy số thông báo chưa đọc ban đầu
    api
      .get(`/notifications/receiver/${userId}`)
      .then((res) => {
      
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
    
        // chỉ tính unread cho đúng role (nếu backend trả về mixed)
        const unread = data.filter(
          (n) =>
            !n.isRead &&
            (!n?.receiverType ||
              n.receiverType.toLowerCase() === mode)
        ).length;
   
        dispatch(setUnreadCount(unread));
      })
      .catch((err) => {
        console.error("[NP] Lỗi lấy notifications:", err);
      });

    // Khi nhận thông báo mới → tăng badge (theo đúng role)
    const handleNewNotification = (payload) => {

      if (
        payload?.receiverType &&
        payload.receiverType.toLowerCase() !== mode
      ) {
        return;
      }
      dispatch(incrementUnread());
    };
   

    onNotification(handleNewNotification);

    return () => {
      offNotification(handleNewNotification);
      disconnectSocket();
    };
  }, [authUser, dispatch]);

  return <>{children}</>;
}