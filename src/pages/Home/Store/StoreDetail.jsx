import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./StoreDetail.css";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

// Mock data (cùng với StorePage)
const mockStores = [
  {
    id: 1,
    name: "Green Café Downtown",
    address: "1262 Kha Vạn Cân, Thủ Đức, TP.HCM",
    coords: [10.8565, 106.7709],
    products: ["cup", "container", "bottle"],
    daily: "9AM - 8PM",
  },
  {
    id: 2,
    name: "Eco Coffee Shop",
    address: "456 River Rd, Uptown, City 67890",
    coords: [10.768, 106.673],
    products: ["cup"],
    daily: "9AM - 8PM",
  },
];

export default function StoreDetail() {
  const { id } = useParams();
  const [store, setStore] = useState(null);

  useEffect(() => {
    const foundStore = mockStores.find((s) => s.id === parseInt(id));
    setStore(foundStore);
  }, [id]);

  if (!store) {
    return <div>Không tìm thấy cửa hàng! (ID: {id})</div>;
  }

  return (
    <div className="storeDetail">
      <div className="storeDetail-banner">
        <div className="storeDetail-container">
          <div className="storeDetail-box">
            <div className="storeDetail-img">
              <img
                src="https://sakos.vn/wp-content/uploads/2024/07/2.-Nha-Trong-Ngo-Quan-ca-phe-dep-o-Ho-Tay.jpg"
                alt={`${store.name} logo`}
              />
            </div>
            <div className="storeDetail-content">
              <Grid container spacing={2}>
                <Grid item size={12}>
                  <Typography variant="h4" component="h1">
                    {store.name}
                  </Typography>
                </Grid>
                <Grid item size={6}>
                  <Typography variant="body1">
                    <strong>Địa chỉ:</strong> {store.address}
                  </Typography>
                </Grid>
                <Grid item size={6}>
                  <Typography variant="body1">
                    <strong>Tọa độ:</strong> {store.coords.join(", ")}
                  </Typography>
                </Grid>
                <Grid item size={6}>
                  <Typography variant="body1">
                    <strong>Sản phẩm:</strong> {store.products.join(", ")}
                  </Typography>
                </Grid>
                <Grid item size={6}>
                  <Typography variant="body1">
                    <strong>Giờ mở cửa:</strong> {store.daily}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
