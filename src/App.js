import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CoursesPage from './pages/CoursePage';
import Home from './pages/Home';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CourseCategoryPage from './pages/CourseCategory';
import { LessonPage } from './pages/LessonPage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/coursecategory" element={<CourseCategoryPage />} />
        <Route path="/courselist/:slug"  element={<CoursesPage />} />
        <Route path="/lessons" element={<LessonPage />} />
      </Routes>
    </Router>
    <ToastContainer />
    </>
  );
}


export default App;
