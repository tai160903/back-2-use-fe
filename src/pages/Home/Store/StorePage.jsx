import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { MdOutlineLocationOn } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import "./StorePage.css";

export default function StorePage() {
  return (
    <>
      <div className="store">
        <div className="store-container">
          <div className="store-header">
            <Typography className="store-title text-black">
              <MdOutlineLocationOn className="mr-2 size-10 text-green-300" />{" "}
              Partner Stores
            </Typography>
            <span style={{ color: "#838383" }}>
              Find stores near you that participate in the Back2Use program
            </span>
          </div>
          <div className="store-search">
            <TextField
              placeholder="Search for location or store name..."
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IoIosSearch size={20} color="#666" />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="store-content">
            <div className="store-map">GG map</div>
            <div className="store-rightInfo">
              <div className="store-nearby">Nearby Stores</div>
              <div className="store-legend">Map Legend</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
