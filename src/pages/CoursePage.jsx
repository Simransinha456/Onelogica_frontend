import React, { useState, useEffect } from "react";
import { Grid, Container, Paper, Typography } from "@mui/material";
import CourseCard from "../components/CourseCard";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../style/CoursePage.css";
import NewCourseModal from "../components/NewcourseModal";

const CoursesPage = () => {
  const location = useLocation();
  const [categoryData, setCategoryData] = useState(location.state);
  const [courses, setCourses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [categoryCourses, setCategoryCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const getCourseData = async (updatedCategory, currentUser) => {
    if (updatedCategory) {
      axios
        .get(`http://localhost:5000/api/course/thisgetcourses`, {
          headers: { Authorization: `Bearer ${currentUser.token}` },
          params: { ids: updatedCategory.courses },
        })
        .then((response) => {
          const allCourses = response.data.data;
          setCategoryCourses(allCourses);
        })
        .catch((error) => {
          console.error("Error fetching courses:", error);
        });
    }
    axios
      .get(`http://localhost:5000/api/course/thisgetcourses`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
        params: { ids: currentUser.courses },
      })
      .then((response) => {
        setCourses(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  };

  useEffect(() => {
    const userData = JSON.parse(
      localStorage.getItem(process.env.USER_LOCALSTORAGE_KEY)
    );
    if (userData) {
      setCurrentUser(userData.data);
      if (categoryData) {
        axios
          .get(`http://localhost:5000/api/course/category/get/${categoryData.slug}`, {
            headers: { Authorization: `Bearer ${userData.data.token}` },
          })
          .then((response) => {
            const updatedCategory = response.data.data;
            setCategoryData(updatedCategory);
            getCourseData(updatedCategory, userData.data);
          })
          .catch((error) => {
            console.error("Error fetching courses:", error);
          });
      } else {
        getCourseData(categoryData, userData.data);
      }
    }
  }, [showModal]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Navbar />
      <Paper
        className="page-header"
        style={{ backgroundColor: "#007bff", padding: "2rem 0" }}
      >
        <Container>
          <Typography
            variant="h4"
            align="center"
            style={{
              color: "#fff",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              position: "sticky",
            }}
          >
            {categoryData ? categoryData.title + " Courses" : "Your Courses"}
          </Typography>
        </Container>
      </Paper>
      <Container className="course-section">
        {currentUser?.isTeacher && categoryData && (
          <button className="newCourse-btn" onClick={handleOpenModal}>
            New Course
          </button>
        )}

        {currentUser?.isTeacher && showModal && (
          <NewCourseModal
            onClose={handleCloseModal}
            category={categoryData._id}
          />
        )}

        {categoryData && (
          <div>
            <div className="grid-container">
              <Typography
                variant="h5"
                className="grid-title"
                style={{ marginBottom: "2rem", textAlign: "left" }}
              >
                {currentUser?.isTeacher ? "Created" : "Registered"}{" "}
                {categoryData.title} Courses
              </Typography>
              <Grid container spacing={2} className="course-grid">
                {courses?.length > 0 ? (
                  courses
                    .filter((course) =>
                      categoryCourses.some(
                        (categoryCourse) => categoryCourse._id === course._id
                      )
                    )
                    .map((course) => (
                      <Grid item xs={12} sm={6} md={4} key={course._id}>
                        <CourseCard course={course} />
                      </Grid>
                    ))
                ) : (
                  <div className="no-courses-message">No Courses Available</div>
                )}
              </Grid>
            </div>
            <div className="grid-container">
              <Typography
                variant="h5"
                className="grid-title"
                style={{ marginBottom: "2rem", textAlign: "left" }}
              >
                All {categoryData.title} Courses
              </Typography>
              <Grid container spacing={2} className="course-grid">
                {categoryCourses?.length > 0 ? (
                  categoryCourses.map((course) => (
                    <Grid item xs={12} sm={6} md={4} key={course._id}>
                      <CourseCard course={course} />
                    </Grid>
                  ))
                ) : (
                  <div className="no-courses-message">No Courses Available</div>
                )}
              </Grid>
            </div>
          </div>
        )}
        {!categoryData && (
          <div className="grid-container">
            <Grid container spacing={2} className="course-grid">
              {courses?.length > 0 ? (
                courses.map((course) => (
                  <Grid item xs={12} sm={6} md={4} key={course._id}>
                    <CourseCard course={course} />
                  </Grid>
                ))
              ) : (
                <div className="no-courses-message">No Courses Available</div>
              )}
            </Grid>
          </div>
        )}
      </Container>
    </div>
  );
};

export default CoursesPage;
