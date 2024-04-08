import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import NewLessonModal from "../components/NewLessonModal";
import "../style/LessonPage.css";

export const LessonPage = () => {
  const location = useLocation();
  const [courseData, setCourseData] = useState(location.state.course);
  const [teacherData, setTeacherData] = useState(location.state.teacher);
  const [currentUser, setCurrentUser] = useState(null);
  const [lessons, setLessons] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem(process.env.USER_LOCALSTORAGE_KEY));
    if (userData) {
      setCurrentUser(userData.data);
      axios
        .get(`http://localhost:5000/api/lesson/thisCourseLessons`, {
          headers: { Authorization: `Bearer ${userData.data.token}` },
          params: { id: courseData._id },
        })
        .then((response) => {
          setLessons(response.data.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching lessons:", error);
        });
    }
  }, [showModal]);

  const handleViewLesson = (lesson) => {
    setSelectedLesson(selectedLesson === lesson ? null : lesson);
  };

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
          <Typography variant="h4">{courseData?.title}</Typography>
        </Container>
      </Paper>

      <div className="page-container">
        <div className="drawer-container">
          <div className="image-container">
            <img
              src={teacherData?.profilePic}
              alt="Teacher"
              className="teacher-picture"
            />
          </div>
          <Typography variant="h6" className="teacher-name">
            Lecturer: {teacherData?.name}
          </Typography>
          <Typography className="teacher-faculty">
            Faculty: {teacherData?.faculty}
          </Typography>
          <Typography className="teacher-email">
            Contact: {teacherData?.email}
          </Typography>
        </div>
       
        <Box className="lesson-container">
        {currentUser?.isTeacher && (
          <button className="create-lesson-button" onClick={handleOpenModal}>
            Create New Lesson
          </button>
        )}

        {currentUser?.isTeacher && showModal && (
          <NewLessonModal
            onClose={handleCloseModal}
            course={courseData}
            currentUser={currentUser}
          />
        )}
          <List className="lesson-list">
            {lessons &&
              lessons.map((lesson, index) => (
                <React.Fragment key={lesson._id}>
                  <ListItemButton
                    className="lesson-item"
                    onClick={() => handleViewLesson(lesson)}
                  >
                    <Typography variant="body1">{lesson.title}</Typography>
                    <Typography variant="body1">{index + 1}/{lessons.length}</Typography>
                    {selectedLesson === lesson ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemButton>
                  <Collapse
                    in={selectedLesson === lesson}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box className="lesson-item">
                      <Typography className="lesson-content" variant="body1">
                      <Typography className="lesson-content-title" variant="body1"> Video: </Typography> 
                      </Typography>
                      <iframe
                        className="lesson-video"
                        src={lesson.video}
                        title={lesson.title}
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                      <Typography className="lesson-content" variant="body1">
                      <Typography className="lesson-content-title" variant="body1"> Content: </Typography>
                        {lesson.content}
                      </Typography>
                    </Box>
                  </Collapse>
                  <Divider />
                </React.Fragment>
              ))}
          </List>
        </Box>
      </div>
    </div>
  );
};
