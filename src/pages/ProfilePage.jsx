import React from "react";
import { Container, Paper, Typography } from "@mui/material";
import ProfileForm from "../components/ProfileForm";
import Navbar from "../components/Navbar";

const ProfilePage = () => {
  return (
    <div>
      <Navbar></Navbar>
      <Paper style={{ backgroundColor: "#007bff", padding: "2rem 0" }}>
        <Container>
          <Typography
            variant="h4"
            align="center"
            style={{ color: "#fff", textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
          >
            User Profile
          </Typography>
        </Container>
      </Paper>
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;
