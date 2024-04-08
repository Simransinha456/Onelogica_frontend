import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import "../style/HeroSection.css"; 
import { useState, useEffect } from "react";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const HeroSection = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem(process.env.USER_LOCALSTORAGE_KEY));
    if (userData) {
      setCurrentUser(userData.data);
    }
  }, []);
  return (
    <div className="hero-section">
      <Container>
        <div className="content-box">
          <Typography
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Welcome to the EduVerse
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
          >
            {currentUser
              ? `Welcome Back ${currentUser?.name} 👋`
              : "Start your learning journey today!"}
          </Typography>

          <div className="button-container">
            {currentUser ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/courselist/your-courses"
                >
                  View Your Courses
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/register"
                >
                    <PersonAddIcon
                fontSize="medium"
                style={{ marginRight: "0.5rem" }}
              />
                  Register
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to="/login"
                  style={{ marginLeft: "1rem" }}
                >
                   <LoginIcon
                fontSize="medium"
                style={{ marginRight: "0.5rem" }}
              />
                  Login
                </Button>
              </>
            )}
            ;
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HeroSection;
