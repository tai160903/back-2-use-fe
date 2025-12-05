
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
    console.log("[NP] NotificationProvider mounted. authUser =", authUser);

    const userId =
      authUser?.user?._id || authUser?.user?._uid || authUser?._id || null;
    if (!userId) {
      console.log("[NP] ❗ Không tìm thấy userId → không connect socket");
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

    console.log("[NP] ✔ Bắt đầu connect socket với:", { userId, mode });
    connectSocket(userId, mode);

    // Lấy số thông báo chưa đọc ban đầu
    api
      .get(`/notifications/receiver/${userId}`)
      .then((res) => {
        console.log("[NP] API trả về notification:", res.data);
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        console.log("[NP] Danh sách:", data);
        // chỉ tính unread cho đúng role (nếu backend trả về mixed)
        const unread = data.filter(
          (n) =>
            !n.isRead &&
            (!n?.receiverType ||
              n.receiverType.toLowerCase() === mode)
        ).length;
        console.log("[NP] Số chưa đọc:", unread);
        dispatch(setUnreadCount(unread));
      })
      .catch((err) => {
        console.error("[NP] Lỗi lấy notifications:", err);
      });

    // Khi nhận thông báo mới → tăng badge (theo đúng role)
    const handleNewNotification = (payload) => {
      console.log("[NP] Nhận thông báo mới:", payload);
      if (
        payload?.receiverType &&
        payload.receiverType.toLowerCase() !== mode
      ) {
        return;
      }
      dispatch(incrementUnread());
    };
    console.log("[NP] Đăng ký lắng nghe thông báo mới");

    onNotification(handleNewNotification);

    return () => {
      offNotification(handleNewNotification);
      disconnectSocket();
    };
  }, [authUser, dispatch]);

  return <>{children}</>;
}