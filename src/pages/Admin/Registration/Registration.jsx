import React, { useEffect, useState } from "react";
import "./Registration.css";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { CiClock2 } from "react-icons/ci";
import { SiTicktick } from "react-icons/si";
import { BiMessageSquareX } from "react-icons/bi";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoWarningOutline } from "react-icons/io5";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { IoIosSearch } from "react-icons/io";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { CiMail } from "react-icons/ci";
import { MdOutlinePhone } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { TiClipboard } from "react-icons/ti";
import Button from "@mui/material/Button";
import ModalRegistration from "../../../components/ModalRegistration/ModalRegistration";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinesses } from "../../../store/slices/bussinessSlice";

export default function Registration() {
  const [filter, setFilter] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const { businesses, totalPages } = useSelector(
    (state) => state.businesses
  );
  useEffect(() => {
    dispatch(getAllBusinesses({ page: currentPage, limit: 10 }))
  }, [dispatch, currentPage]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (event, newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const getFilteredData = (businesses) => {
    let filtered = [...businesses];
    if (filter !== "All") {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === filter.toLowerCase()
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.businessMail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.businessPhone.includes(searchTerm)
      );
    }
    return filtered;
  };

  const handleActionClick = (item) => {
    setSelectedItem(item);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedItem(null);
  };

  return (
    <>
      <div className="registration">
        <div className="registration-container">
          <div className="registration-header">
            <Grid container spacing={2}>
              <Grid item size={3} className="registration-card registration-card-0">
                <div>
                  <Typography className="registration-card-title">
                    Total Applications
                    <span> {businesses.length}</span>
                  </Typography>
                </div>
                <div>
                  <PiClipboardTextBold className=" size-8 text-[#103713]" />
                </div>
              </Grid>
              <Grid item size={3} className="registration-card registration-card-1">
                <div>
                  <Typography className="registration-card-title">
                    Pending Review
                    <span className="text-[#856404]">
                      {" "}
                      {
                        businesses.filter((item) => item.status === "pending")
                          .length
                      }
                    </span>
                  </Typography>
                </div>
                <div>
                  <CiClock2 className=" size-8 text-[#856404]" />
                </div>
              </Grid>
              <Grid item size={3} className="registration-card registration-card-2">
                <div>
                  <Typography className="registration-card-title">
                    Approved
                    <span className="text-[#155724]">
                      {" "}
                      {
                        businesses.filter((item) => item.status === "approved")
                          .length
                      }
                    </span>
                  </Typography>
                </div>
                <div>
                  <SiTicktick className=" size-8 text-[#155724]" />
                </div>
              </Grid>
              <Grid item size={3} className="registration-card registration-card-3">
                <div>
                  <Typography className="registration-card-title">
                    Rejected
                    <span className="text-[#721c24]">
                      {" "}
                      {
                        businesses.filter((item) => item.status === "rejected")
                          .length
                      }
                    </span>
                  </Typography>
                </div>
                <div>
                  <BiMessageSquareX className=" size-8 text-[#721c24]" />
                </div>
              </Grid>
            </Grid>
          </div>
          <div className="registration-body">
            <div className="registration-body-header">
              <div className="registration-body-header-title">
                <PiClipboardTextBold className="mr-2 size-6" /> Business
                Registration Management
              </div>
              <Typography className="registration-body-text">
                <IoWarningOutline className="mr-2 size-6" />{" "}
                {businesses.filter((item) => item.status === "pending").length}{" "}
                pending
              </Typography>
            </div>
            <div className="registration-body-des">
              <Typography>
                Review and manage business applications by status
              </Typography>
            </div>
            <div className="registration-search">
              <TextField
                placeholder="Search by Business Name, Email, Phone Number"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IoIosSearch size={20} color="#666" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="registration-tabs">
              <Tabs
                value={filter}
                onChange={handleFilterChange}
                aria-label="status filter tabs"
                sx={{
                  width: "100%",
                  "& .MuiTabs-indicator": {
                    backgroundColor: "transparent",
                    marginBottom: "30px",
                  },
                  "& .MuiTab-root": {
                    backgroundColor: "#f5f5f5",
                    color: "#5b6b62",
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: "600",
                    flex: 1,
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    "&.Mui-selected": {
                      backgroundColor: "#103713",
                      color: "#FFFFFF",
                      boxShadow: "rgba(16, 55, 19, 0.3) 0px 4px 12px",
                    },
                    marginBottom: "30px",
                  },
                }}
              >
                <Tab
                  label={`Pending (${
                    businesses.filter((item) => item.status === "pending")
                      .length
                  })`}
                  value="pending"
                  icon={<CiClock2 />}
                  iconPosition="start"
                />
                <Tab
                  label={`Approved (${
                    businesses.filter((item) => item.status === "approved")
                      .length
                  })`}
                  value="approved"
                  icon={<SiTicktick />}
                  iconPosition="start"
                />
                <Tab
                  label={`Rejected (${
                    businesses.filter((item) => item.status === "rejected")
                      .length
                  })`}
                  value="rejected"
                  icon={<BiMessageSquareX />}
                  iconPosition="start"
                />
              </Tabs>
              {getFilteredData(businesses).map((item) => (
                <Box className="registration-card-item" key={item.id}>
                  <div className="registration-card-content">
                    <div className="registration-card-avt">
                      <img 
                        src={item.businessLogoUrl} 
                        alt={item.businessName}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold text-lg" style={{display: 'none'}}>
                        {item.businessName?.charAt(0)?.toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <Typography className="registration-card-name">
                        {item.businessName}
                        <span className={`registration-card-status ${item.status}`}>
                          {item.status}
                        </span>
                      </Typography>
                      <Typography className="registration-card-info">
                        <CiMail className="mr-2" />
                        {item.businessMail}
                      </Typography>
                      <Typography className="registration-card-info">
                        <MdOutlinePhone className="mr-2" />
                        {item.businessPhone}
                      </Typography>
                      <Typography className="registration-card-info">
                        <IoLocationOutline className="mr-2" />
                        {item.businessAddress}
                      </Typography>
                      <Typography className="registration-card-info">
                        <TiClipboard className="mr-2" />
                        {item.taxCode}
                      </Typography>
                    </div>
                  </div>
                  <div className="registration-card-button">
                    <Button
                      variant="contained"
                      color={
                        item.status === "pending" ? "primary" : "secondary"
                      }
                      onClick={() => handleActionClick(item)}
                    >
                      {item.status === "pending"
                        ? "Await Approval"
                        : "View Details"}
                    </Button>
                  </div>
                </Box>
              ))}
            </div>
            <Stack
              spacing={2}
              className="mt-5 mb-5"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
              />
            </Stack>
          </div>
        </div>
      </div>
      <ModalRegistration
        open={openPopup}
        onClose={handleClosePopup}
        selectedItem={selectedItem}
      />
    </>
  );
}
