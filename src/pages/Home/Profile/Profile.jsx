import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import Button from "@mui/material/Button";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TextField from "@mui/material/TextField";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CallMissedOutgoingIcon from "@mui/icons-material/CallMissedOutgoing";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import "./Profile.css";
import { Link } from "react-router-dom";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "Sam Rahman",
    email: "sam.rahman9920@gmail.com",
    phone: "+1 - 555-369-030-1236",
    address: "123 Main Street, New York, NY 10001",
  });
  const [initialData, setInitialData] = useState(userData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setInitialData(userData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUserData(initialData);
    setIsEditing(false);
  };

  return (
    <>
      <div className="profile">
        <div className="profile-container">
          <div className="circle-bg" />
          <div className="circle-bg-2" />
          <div className="profile-content">
            <div className="profile-info">
              <div className="profile-info-header">
                <div className="profile-avatar">
                  <img src="https://bigdental.com.vn/wp-content/uploads/2025/04/anh-dai-dien-6-1.jpg" />
                </div>
                <div className="profile-supInfor">
                  <Typography
                    style={{
                      fontSize: "30px",
                      marginTop: "20px",
                      fontWeight: "700",
                    }}
                  >
                    My Profile{" "}
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isEditing
                          ? "text-orange-600 bg-orange-100 hover:bg-orange-200"
                          : "text-gray-500 hover:text-orange-500 hover:bg-orange-50"
                      }`}
                    >
                      <EditIcon className="w-5 h-5" />
                    </button>
                  </Typography>
                  <span>Test Login 07 Aug 2025, 14:42</span>
                  <span>You have to join from GMT 0:00</span>
                </div>
              </div>
              <div className="profile-info-form">
                {isEditing && (
                  <div className="profile-info-content-edit">
                    <div className="profile-info-edit-text">
                      <Typography
                        sx={{
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <EditIcon sx={{ marginRight: "10px" }} /> Edit Mode
                        Active
                      </Typography>
                      <span>
                        {" "}
                        Make changes to your profile information below
                      </span>
                    </div>
                  </div>
                )}
                <form>
                  <div className="profile-info-content">
                    <div className="profile-info-text">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <div className="profile-info-text-icons">
                          <PersonIcon />
                        </div>
                        <div className="profile-info-text-des">
                          <Typography>Full Name</Typography>
                          {isEditing ? (
                            <TextField
                              name="fullName"
                              value={userData.fullName}
                              onChange={handleInputChange}
                              variant="outlined"
                              fullWidth
                              size="small"
                              sx={{ marginTop: "8px" }}
                            />
                          ) : (
                            <span>{userData.fullName}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="profile-info-text">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <div className="profile-info-text-icons">
                          <EmailIcon />
                        </div>
                        <div className="profile-info-text-des">
                          <Typography>Email</Typography>
                          {isEditing ? (
                            <TextField
                              name="email"
                              value={userData.email}
                              onChange={handleInputChange}
                              variant="outlined"
                              fullWidth
                              size="small"
                              type="email"
                              sx={{ marginTop: "8px" }}
                            />
                          ) : (
                            <span>{userData.email}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="profile-info-text">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <div className="profile-info-text-icons">
                          <LocalPhoneIcon />
                        </div>
                        <div className="profile-info-text-des">
                          <Typography>Phone</Typography>
                          {isEditing ? (
                            <TextField
                              name="phone"
                              value={userData.phone}
                              onChange={handleInputChange}
                              variant="outlined"
                              fullWidth
                              size="small"
                              type="tel"
                              sx={{ marginTop: "8px" }}
                            />
                          ) : (
                            <span>{userData.phone}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="profile-info-text">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <div className="profile-info-text-icons">
                          <AddLocationAltIcon />
                        </div>
                        <div className="profile-info-text-des">
                          <Typography>Address</Typography>
                          {isEditing ? (
                            <TextField
                              name="address"
                              value={userData.address}
                              onChange={handleInputChange}
                              variant="outlined"
                              fullWidth
                              size="small"
                              sx={{ marginTop: "8px" }}
                            />
                          ) : (
                            <span>{userData.address}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              {!isEditing && (
                <Button
                  className="profile-info-btn profile-info-btn-save"
                  variant="contained"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
              {isEditing && (
                <div className="profile-info-footer">
                  <Button
                    className="profile-info-btn profile-info-btn-save"
                    variant="contained"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    className="profile-info-btn profile-info-btn-cancel"
                    variant="outlined"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            <div className="right-section">
              <div className="profile-wallet">
                <div className="profile-wallet-title">
                  <Typography style={{ fontSize: "30px", fontWeight: "700" }}>
                    Wallet Balance
                  </Typography>
                  <Link to="/profile" className="profile-filter">
                    <FilterAltIcon className="profile-info-text-icons" />
                    View all
                  </Link>
                </div>
                <div className="profile-wallet-content">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div className="profile-wallet-text-icons">
                      <AccountBalanceWalletIcon
                        sx={{ color: "#179c4a", fontSize: "30px" }}
                      />
                    </div>
                    <div className="profile-wallet-text-des">
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "700",
                          fontSize: "20px",
                        }}
                      >
                        Current Balance
                      </Typography>
                      <span>Available funds</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "end",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "25px",
                        color: "#179c4a",
                        fontWeight: "600",
                      }}
                    >
                      $2,450.00
                    </Typography>
                    <span>USD</span>
                  </div>
                </div>
                <div className="profile-wallet-content">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div className="profile-wallet-text-icons">
                      <AttachMoneyIcon
                        sx={{ color: "#3169ed", fontSize: "30px" }}
                      />
                    </div>
                    <div className="profile-wallet-text-des">
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "700",
                          fontSize: "20px",
                        }}
                      >
                        Pending Balance
                      </Typography>
                      <span>Processing transactions</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "end",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "25px",
                        color: "#3169ed",
                        fontWeight: "600",
                      }}
                    >
                      $125.50
                    </Typography>
                    <span>USD</span>
                  </div>
                </div>
              </div>
              <div className="profile-legitPoint">
                <div className="profile-legitPoint-title">
                  <Typography style={{ fontSize: "30px", fontWeight: "700" }}>
                    Legit Points & Ranking
                  </Typography>
                  <Link to="/profile" className="profile-filter">
                    <FilterAltIcon className="profile-info-text-icons" />
                    View all
                  </Link>
                </div>
                <div className="profile-legitPoint-current">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div className="profile-legitPoint-current-icons">
                      <EmojiEventsIcon
                        sx={{
                          fontSize: "30px",
                        }}
                      />
                    </div>
                    <div className="profile-wallet-text-des">
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "700",
                          fontSize: "30px",
                        }}
                      >
                        2,847 Points
                      </Typography>
                      <span>Current Legit Points</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "end",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "30px",
                        color: "#8f3cd5",
                        fontWeight: "600",
                      }}
                    >
                      #47
                    </Typography>
                    <span style={{ color: "#6b7280" }}>Global Ranking</span>
                  </div>
                </div>
                <div className="profile-legitPoint-progress">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div className="profile-legitPoint-progress-icons">
                      <CallMissedOutgoingIcon
                        sx={{ color: "white", fontSize: "30px" }}
                      />
                    </div>
                    <div className="profile-wallet-text-des">
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "700",
                          fontSize: "18px",
                        }}
                      >
                        Weekly Progress
                      </Typography>
                      <span>+245 points this week</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "end",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "25px",
                        color: "#0fa34e",
                        fontWeight: "600",
                      }}
                    >
                      <ArrowUpwardIcon /> 3
                    </Typography>
                    <span style={{ color: "#6b7280" }}>Rank improved</span>
                  </div>
                </div>
                <div className="profile-legitPoint-activity">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div className="profile-legitPoint-activity-icons">
                      <StarBorderIcon
                        sx={{ color: "white", fontSize: "30px" }}
                      />
                    </div>
                    <div className="profile-wallet-text-des">
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "700",
                          fontSize: "18px",
                        }}
                      >
                        Recent Activity
                      </Typography>
                      <span>Cup return bonus</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "end",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "25px",
                        color: "#a755f7",
                        fontWeight: "600",
                      }}
                    >
                      <AddIcon /> 50
                    </Typography>
                    <span style={{ color: "#6b7280" }}>2 hours ago</span>
                  </div>
                </div>
                <div className="profile-legitPoint-achievement ">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div className="profile-legitPoint-achievement-icons">
                      <WorkspacePremiumIcon
                        sx={{ color: "white", fontSize: "30px" }}
                      />
                    </div>
                    <div className="profile-wallet-text-des">
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "700",
                          fontSize: "18px",
                        }}
                      >
                        Achievement Level
                      </Typography>
                      <span>Gold Member Status</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "end",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "25px",
                        color: "#3b82f6",
                        fontWeight: "600",
                      }}
                    >
                      <AddIcon /> Level 8
                    </Typography>
                    <span style={{ color: "#6b7280" }}>Next: 3,000 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
