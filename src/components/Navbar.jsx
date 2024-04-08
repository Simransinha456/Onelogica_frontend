import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Avatar,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem(process.env.USER_LOCALSTORAGE_KEY));
    if (userData) {
      setCurrentUser(userData.data);
    }
  }, []);

  const handleLogoClick = (event) => {
    event.currentTarget.style.color = "white";
  };

  const handleLogout = () => {
    setCurrentUser(undefined);
    localStorage.removeItem(process.env.USER_LOCALSTORAGE_KEY);
    navigate("/");
    window.location.reload();
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item display={"flex"} alignItems={"center"}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              onClick={handleLogoClick}
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <HomeIcon style={{ marginRight: "0.5rem" }} />
              EduVerse
            </Typography>
          </Grid>
          <Grid item>
            {currentUser && (
              <Box display="flex" alignItems="center">
                <Button component={Link} to="/coursecategory" color="inherit">
                  <ClassIcon style={{ marginRight: "0.5rem" }} />
                  Categories
                </Button>
                <Button
                  onClick={() => {navigate(`/courselist/your-courses`); window.location.reload();}}
                  color="inherit"
                >
                  <SchoolIcon style={{ marginRight: "0.5rem" }} />
                  Your Courses
                </Button>
                <Button component={Link} to="/profile" color="inherit">
                  <PersonIcon style={{ marginRight: "0.5rem" }} />
                  Profile
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
                <Avatar
                  alt={currentUser}
                  src={currentUser.profilePic}
                  style={{ marginRight: `0.5rem`, marginLeft: `1rem` }}
                />
                <Typography variant="body1" color="inherit">
                  {currentUser.name}
                </Typography>
              </Box>
            )}
            {!currentUser && (
              <>
                <Button component={Link} to="/login" color="inherit">
                  Login
                </Button>
                <Button component={Link} to="/register" color="inherit">
                  Register
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
