import BusinessNavbar from "../BusinessNavbar/BusinessNavbar";
import { PATH } from "../../routes/path";
import { IoHomeOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { IoGiftOutline } from "react-icons/io5";
import { GoHistory } from "react-icons/go";
import { FaBoxOpen } from "react-icons/fa";

const staffSidebarItems = [
  {
    id: "staff-dashboard",
    icon: <IoHomeOutline className="navbar-icon" />,
    label: "Staff Dashboard",
    path: PATH.STAFF,
  },
  {
    id: "staff-profile",
    label: "My Profile",
    icon: <FaUser className="navbar-icon" />,
    path: PATH.STAFF_PROFILE,
  },
  {
    id: "online-borrow-orders",
    label: "Online Orders",
    path: PATH.STAFF_ONLINE_BORROW_ORDERS,
  },
  {
    id: "staff-transaction",
    label: "Transaction History",
    icon: <GoHistory className="navbar-icon" />,
    path: PATH.STAFF_TRANSACTION,
  },
  {
    id: "staff-voucher",
    label: "Apply Voucher",
    icon: <IoGiftOutline className="navbar-icon" />,
    path: PATH.STAFF_VOUCHER,
  },
  {
    id: "staff-return",
    label: "Return Product",
    icon: <FaBoxOpen className="navbar-icon" />,
    path: PATH.STAFF_RETURN,
  },
  {
    id: "logout",
    label: "Logout",
    path: null,
  },
];

export default function StaffNavbar(props) {
  return <BusinessNavbar sidebarItems={staffSidebarItems} {...props} />;
}
