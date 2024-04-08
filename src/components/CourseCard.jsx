import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, Typography } from "@mui/material";
import "../style/CourseCard.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CourseCard = ({ course }) => {
  const [teacher, setTeacher] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(null);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem(process.env.USER_LOCALSTORAGE_KEY));
    if (userData) {
      setCurrentUser(userData.data);
      axios
        .get(`http://localhost:5000/api/user/getuser/${course.teacher}`, {
          headers: { Authorization: `Bearer ${userData.data.token}` },
        })
        .then((response) => {
          setTeacher(response.data.data);
        });
    }
  }, []);

  const handleEnroll = (id) => {
    console.log(currentUser.token);
    axios
      .post(`http://localhost:5000/api/course/enroll/${id}`, null, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      })
      .then((response) => {
        console.log(response);
        const updatedUserData = {
          ...currentUser,
          courses: response.data.data.courses,
        };
        localStorage.setItem(
          process.env.USER_LOCALSTORAGE_KEY,
          JSON.stringify({ data: updatedUserData })
        );
        toast.success(
          `Enrolled to ${course?.title} Successfully`,
          toastOptions
        );
        setIsEnrolled(true);
      })
      .catch((error) => {
        console.error("Error Enrolling to course:", error);
      });
  };

  return (
    <>
      <Card className="course-card">
        {teacher && (
          <>
            <img
              src={course.image}
              alt="course cover"
              className="course-image"
            />
            <CardContent>
              <Typography variant="h2" className="course-title">
                {course.title}
              </Typography>
              <Typography variant="body2" className="course-teacher">
                Lecturer: {teacher?.name}
              </Typography>
              <Typography variant="body2" className="course-description">
                {course.description}
              </Typography>
              {currentUser?.courses?.includes(course._id) ||
              isEnrolled ||
              currentUser?.isTeacher ? (
                <Button
                  className="course-card-button"
                  state={{ course: course, teacher: teacher }}
                  component={Link}
                  to={{
                    pathname: "/lessons",
                  }}
                  variant="contained"
                  color="primary"
                >
                  View Course
                </Button>
              ) : (
                <Button
                  className="course-card-button"
                  variant="contained"
                  color="primary"
                  onClick={() => handleEnroll(course._id)}
                >
                  Enroll
                </Button>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </>
  );
};

export default CourseCard;
