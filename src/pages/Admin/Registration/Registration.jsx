import React, { useState } from "react";
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
import { GrSchedule } from "react-icons/gr";
import Button from "@mui/material/Button";
import ModalRegistration from "../../../components/ModalRegistration/ModalRegistration";

export default function Registration() {
  const [filter, setFilter] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock data based on the image
  const mockData = [
    {
      id: 1,
      name: "Green Bistro",
      email: "contact@greenbistro.com",
      phone: "+1234567895",
      address: "789 Elm St, Midtown, City 12347",
      type: "Restaurant",
      status: "Pending",
      appliedDate: "25/1/2024",
    },
    {
      id: 2,
      name: "Eco Coffee House",
      email: "mike@ecocoffee.com",
      phone: "+1555234567",
      address: "456 Green Avenue, Downtown, City 12348",
      type: "Coffee Shop",
      status: "Pending",
      appliedDate: "12/2/2024",
    },
    {
      id: 3,
      name: "Fresh Market Deli",
      email: "lisa@freshmarket.com",
      phone: "+1555345678",
      address: "123 Market Street, Uptown, City 12349",
      type: "Grocery Store",
      status: "Pending",
      appliedDate: "15/3/2024",
    },
    {
      id: 4,
      name: "Blue Cafe",
      email: "info@bluecafe.com",
      phone: "+1998765432",
      address: "321 Blue Lane, City 12350",
      type: "Cafe",
      status: "Approved",
      appliedDate: "10/1/2024",
    },
    {
      id: 5,
      name: "Red Bakery",
      email: "contact@redbakery.com",
      phone: "+1444333222",
      address: "555 Red Road, City 12351",
      type: "Bakery",
      status: "Rejected",
      appliedDate: "20/2/2024",
    },
  ];

  const handleFilterChange = (event, newFilter) => {
    setFilter(newFilter);
  };

  const getFilteredData = (data) => {
    let filtered = [...data];
    if (filter !== "All") {
      filtered = filtered.filter((item) => item.status === filter);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.phone.includes(searchTerm)
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
              <Grid item size={3} className="registration-card">
                <div>
                  <Typography className="registration-card-title">
                    Total Applications
                    <span> {mockData.length}</span>
                  </Typography>
                </div>
                <div>
                  <PiClipboardTextBold className=" size-8 text-[#1d8783]" />
                </div>
              </Grid>
              <Grid item size={3} className="registration-card">
                <div>
                  <Typography className="registration-card-title">
                    Pending Review
                    <span className="text-[#f6ba35]">
                      {" "}
                      {
                        mockData.filter((item) => item.status === "Pending")
                          .length
                      }
                    </span>
                  </Typography>
                </div>
                <div>
                  <CiClock2 className=" size-8 text-[#f6ba35]" />
                </div>
              </Grid>
              <Grid item size={3} className="registration-card">
                <div>
                  <Typography className="registration-card-title">
                    Approved
                    <span className="text-[#127300]">
                      {" "}
                      {
                        mockData.filter((item) => item.status === "Approved")
                          .length
                      }
                    </span>
                  </Typography>
                </div>
                <div>
                  <SiTicktick className=" size-8 text-[#127300]" />
                </div>
              </Grid>
              <Grid item size={3} className="registration-card">
                <div>
                  <Typography className="registration-card-title">
                    Rejected
                    <span className="text-[#d3011c]">
                      {" "}
                      {
                        mockData.filter((item) => item.status === "Rejected")
                          .length
                      }
                    </span>
                  </Typography>
                </div>
                <div>
                  <BiMessageSquareX className=" size-8 text-[#d3011c]" />
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
                {mockData.filter((item) => item.status === "Pending").length}{" "}
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
                    backgroundColor: "#eeeeee",
                    color: "#000000",
                    textTransform: "none",
                    fontSize: "16px",
                    flex: 1,
                    borderRadius: "8px",
                    "&.Mui-selected": {
                      backgroundColor: "#2E7D32",
                      color: "#FFFFFF",
                    },
                    marginBottom: "30px",
                  },
                }}
              >
                <Tab
                  label={`Pending (${
                    mockData.filter((item) => item.status === "Pending").length
                  })`}
                  value="Pending"
                  icon={<CiClock2 />}
                  iconPosition="start"
                />
                <Tab
                  label={`Approved (${
                    mockData.filter((item) => item.status === "Approved").length
                  })`}
                  value="Approved"
                  icon={<SiTicktick />}
                  iconPosition="start"
                />
                <Tab
                  label={`Rejected (${
                    mockData.filter((item) => item.status === "Rejected").length
                  })`}
                  value="Rejected"
                  icon={<BiMessageSquareX />}
                  iconPosition="start"
                />
              </Tabs>
              {getFilteredData(mockData).map((item) => (
                <Box className="registration-card-item" key={item.id}>
                  <div className="registration-card-content">
                    <div className="registration-card-avt">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <Typography className="registration-card-name">
                        {item.name}
                        <span className="registration-card-status">
                          {item.status}
                        </span>
                      </Typography>
                      <Typography className="registration-card-info">
                        <CiMail className="mr-2" />
                        {item.email}
                      </Typography>
                      <Typography className="registration-card-info">
                        <MdOutlinePhone className="mr-2" />
                        {item.phone}
                      </Typography>
                      <Typography className="registration-card-info">
                        <IoLocationOutline className="mr-2" />
                        {item.address}
                      </Typography>
                      <Typography className="registration-card-info">
                        <TiClipboard className="mr-2" />
                        {item.type}
                      </Typography>
                      <Typography className="registration-card-info">
                        <GrSchedule className="mr-2" />
                        {item.appliedDate}
                      </Typography>
                    </div>
                  </div>
                  <div className="registration-card-button">
                    <Button
                      variant="contained"
                      color={
                        item.status === "Pending" ? "primary" : "secondary"
                      }
                      onClick={() => handleActionClick(item)}
                    >
                      {item.status === "Pending"
                        ? "Await Approval"
                        : "View Details"}
                    </Button>
                  </div>
                </Box>
              ))}
            </div>
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
