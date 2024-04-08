import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    faculty: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isTeacher, setIsTeacher] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [passwordStrengthError, setPasswordStrengthError] = useState("");
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
    console.log(name + ": " + value);
    if (name === "email" && value.includes("@eduverse.com")) {
      setIsTeacher(true);
    } else if(name === "email" && !value.includes("@eduverse.com")) {
      setIsTeacher(false);
    }
    if (
      name === "password" &&
      !(/[A-Z]/.test(value) && /[0-9]/.test(value) && value.length >= 8)
    ) {
      setPasswordStrengthError(
        "Password should be at least 8 characters long and contain at least one uppercase letter and one number"
      );
    } 
    else if(
      name === "password" &&
      (/[A-Z]/.test(value) && /[0-9]/.test(value) && value.length >= 8)) {
      setPasswordStrengthError("");
    }

    if (name === "confirmPassword" && value !== formData.password) {
      setPasswordMatchError("Passwords do not match");
      return;
    } else if(name === "confirmPassword" && value == formData.password) {
      setPasswordMatchError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await axios.post(
        `https://onelogica-backend.vercel.app/api/user/register`,
        {
          name: formData.name,
          email: formData.email,
          faculty: formData.faculty,
          password: formData.password,
          isTeacher: isTeacher,
        }
      );
      console.log("Registration Successful:", userData);
      toast.success(`Registration Successful`, toastOptions);
      navigate("/login");
    } catch (err) {
      console.log("Error registering user:", err);
      console.log(err);
    }
  };

  return (
    <Box
        sx={{
          backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/eduverse-aa2e0.appspot.com/o/Project%20Images%2FRegistration%20Page.jpg?alt=media&token=fe9671bb-23b2-4f09-b9ac-9ee2fe94392b)`,
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
          margin: "15vh 0",
        }}
      >
        <Typography
          variant="h4"
          color="primary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <PersonAddIcon
            color="primary"
            fontSize="large"
            style={{ marginRight: "0.5rem" }}
          />
          Create New Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            style={{ backgroundColor: "white" }}
            required
            fullWidth
            label="Name"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
          />
          <FormControl
            style={{ backgroundColor: "white" }}
            required
            fullWidth
            variant="outlined"
            margin="normal"
          >
            <InputLabel>Faculty</InputLabel>
            <Select
              label="Faculty"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
            >
              <MenuItem value="Informatics">Informatics</MenuItem>
              <MenuItem value="Engineering">Engineering</MenuItem>
              <MenuItem value="Arts">Arts</MenuItem>
              <MenuItem value="Medicine">Medicine</MenuItem>
              <MenuItem value="Science">Science</MenuItem>
            </Select>
          </FormControl>
          <TextField
            style={{ backgroundColor: "white" }}
            required
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            style={{ backgroundColor: "white" }}
            required
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            error={!!passwordStrengthError}
            helperText={passwordStrengthError}
          />
          <TextField
            style={{ backgroundColor: "white" }}
            required
            fullWidth
            label="Confirm Password"
            variant="outlined"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            error={!!passwordMatchError}
            helperText={passwordMatchError}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "1rem" }}
          >
            Register
          </Button>
        </form>

        <Typography
          variant="body1"
          align="center"
          style={{ marginTop: "1rem" }}
        >
          Already registered? <Link to="/login">Login here</Link>
        </Typography>
      </Box>
    </Container>
    </Box>
  );
};

export default RegistrationForm;
