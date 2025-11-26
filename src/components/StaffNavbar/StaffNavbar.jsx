import BusinessNavbar from "../BusinessNavbar/BusinessNavbar";
import { PATH } from "../../routes/path";


const staffSidebarItems = [
  {
    id: "business-dashboard", 
    label: "Staff Dashboard",
    path: PATH.STAFF,
  },
  {
    id: "online-borrow-orders",
    label: "Online Orders",
    path: PATH.STAFF_ONLINE_BORROW_ORDERS,
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


