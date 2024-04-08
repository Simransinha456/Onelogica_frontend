import React, { useState } from "react";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginIcon from "@mui/icons-material/Login";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  };

  useEffect(() => {
    if (localStorage.getItem(process.env.USER_LOCALSTORAGE_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email === "" || formData.password === "") {
      toast.info(`Please Enter Email and Passowrd`, toastOptions);
    } else {
      console.log("Form submitted:", formData);

      try {
        const userData = await axios.post(`https://onelogica-backend.vercel.app/api/user/login`, {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem(process.env.USER_LOCALSTORAGE_KEY, JSON.stringify(userData));
        console.log("Form submitted:", userData);
        toast.success(`Login Successful`, toastOptions);
        navigate("/");
      } catch (err) {
        console.log(err);
        toast.error(`Invalid Email or Password`, toastOptions);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/eduverse-aa2e0.appspot.com/o/Project%20Images%2FLoginPage.jpg?alt=media&token=f30fb17d-801e-4b0a-9f74-babf3ad25ba0)`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: 4,
              boxShadow: 1,
              margin: "25vh 0",
            }}
          >
            <Typography
              variant="h4"
              color="primary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <LoginIcon
                color="primary"
                fontSize="large"
                style={{ marginRight: "0.5rem" }}
              />
              Login
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                type="email"
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "1rem" }}
              >
                Log In
              </Button>
            </form>
            <Typography
              variant="body1"
              align="center"
              style={{ marginTop: "1rem" }}
            >
              Don't have an Account? <Link to="/register">Register here!</Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LoginForm;
