import React, { useState, useEffect } from "react";
import axios from "axios";
import NewCategoryModal from "../components/NewCategoryModal";
import "../style/CourseCategoryPage.css";
import Navbar from "../components/Navbar";
import {
  Container,
  Paper,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CourseCategoryPage = () => {
  const [courseCategories, setCourseCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  };

  const handleNewCategoryClick = () => {
    setShowModal(true);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/course/category/delete/${id}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      })
      .then((response) => {
        console.log(response);
        toast.info(`Category Deleted Successfully`, toastOptions);
      })
      .catch((error) => {
        console.error("Error deleting course category:", error);
      });
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem(process.env.USER_LOCALSTORAGE_KEY));
    console.log(userData.data);
    axios
      .get("http://localhost:5000/api/course/category/getall", {
        headers: { Authorization: `Bearer ${userData.data.token}` },
      })
      .then((response) => {
        setCourseCategories(response?.data.data);
        setCurrentUser(userData.data);
      })
      .catch((error) => {
        console.error("Error fetching course categories:", error);
      });
  }, [showModal, handleDelete]);

  return (
    <div>
      <Navbar />
      <Paper style={{ backgroundColor: "#007bff", padding: "2rem 0" }}>
        <Container>
          <Typography
            variant="h4"
            align="center"
            style={{ color: "#fff", textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
          >
            Course Categories
          </Typography>
        </Container>
      </Paper>
      <div className="course-category-page">
        {currentUser?.isTeacher && (
          <button className="newCategory-btn" onClick={handleNewCategoryClick}>
            New Category
          </button>
        )}
        {showModal && (
          <NewCategoryModal
            onClose={() => {
              setShowModal(false);
            }}
          />
        )}

        <div className="category-cards">
          {courseCategories.map((category) => (
            <div key={category._id} className="category-card">
              <img
                src={category?.image}
                alt={category?.title}
                className="category-image"
              />
              <h2>{category?.title}</h2>
              <div className="button-container">
                <Button
                  state={category}
                  component={Link}
                  to={{
                    pathname: `/courselist/${category?.slug}`,
                  }}
                  variant="contained"
                  color="primary"
                >
                  View Courses
                </Button>
                {currentUser?.isTeacher && (
                  <>
                    <IconButton aria-label="edit" size="small"></IconButton>
                    <IconButton
                      aria-label="delete"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(category._id)}
                    >
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseCategoryPage;
