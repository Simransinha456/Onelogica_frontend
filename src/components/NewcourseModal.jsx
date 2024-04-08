import React, { useState } from "react";
import axios from "axios";
import app from "../firebase";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../style/NewCourseModal.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewCourseModal = ({ onClose, category }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !image) {
      return;
    }
    try {
      const userData = await JSON.parse(localStorage.getItem(process.env.USER_LOCALSTORAGE_KEY));
      const currentUser = userData.data;
      const response = await axios.post(
        `https://onelogica-backend.vercel.app/api/course/createcourse/${category}`,
        {
          title,
          description,
          image,
        },
        { headers: { Authorization: `Bearer ${userData.data.token}` } }
      );

      const updatedUserData = {
        ...currentUser,
        courses: currentUser.courses.concat(response.data.data._id),
      };
      localStorage.setItem(
        process.env.USER_LOCALSTORAGE_KEY,
        JSON.stringify({ data: updatedUserData })
      );
      console.log("New course created:", response.data);
      toast.success(
        `${title}: New Course Created Successfully`,
        toastOptions
      );
      onClose();
    } catch (error) {
      console.error("Error creating new course:", error);
    }
  };

  const uploadProfilePicToFirebase = (file) => {
    const storageRef = getStorage(app);
    const profilePicRef = ref(
      storageRef,
      `Course_category_pictures/${title + Date.now()}`
    );

    uploadBytes(profilePicRef, file)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => {
        setImage(url);
        console.log("Course Cover uploaded to Firebase:", url);
      })
      .catch((error) => {
        console.error("Error uploading Category Cover:", error);
      });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    uploadProfilePicToFirebase(file);
  };

  return (
    <div className="new-course-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <form onSubmit={handleSubmit}>
          <div className="image-preview">
            {image && <img src={image} alt="Uploaded" />}
          </div>
          <div>
            <label htmlFor="title">Course Title</label>
            <input
              className="input-field"
              type="text"
              placeholder="Course Title"
              required={true}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description">Course Description</label>
            <textarea
              className="input-field"
              placeholder="Course Description"
              required={true}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="image">Course Image</label>
            <input
              className="input-field file-input"
              type="file"
              accept="image/*"
              required={true}
              onChange={handleImageUpload}
            />
          </div>
          <button className="submit-button" type="submit">
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewCourseModal;
