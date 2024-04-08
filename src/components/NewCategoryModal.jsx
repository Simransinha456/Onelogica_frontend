import React, { useState } from "react";
import axios from "axios";
import "../style/NewCategoryModal.css";
import app from "../firebase";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewCategoryModal = ({ onClose }) => {
  const [title, setTitle] = useState("");
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
    if (!title || !image) {
      return;
    }
    try {
      const userData = await JSON.parse(localStorage.getItem(process.env.USER_LOCALSTORAGE_KEY));
      const response = await axios.post(
        "https://onelogica-backend.vercel.app/api/course/category/createcategory",
        {
          title,
          image,
        },
        { headers: { Authorization: `Bearer ${userData.data.token}` } }
      );

      console.log("New category created:", response.data.data);
      toast.success(
        `${title}: New Category Created Successfully`,
        toastOptions
      );
      onClose();
    } catch (error) {
      console.error("Error creating new category:", error);
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
        console.log("Category Cover uploaded to Firebase:", url);
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
    <div className="new-category-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <form onSubmit={handleSubmit}>
          <div className="image-preview">
            {image && <img src={image} alt="Uploaded" />}
          </div>
          <div>
            <label htmlFor="title">Category Title</label>
            <input
              className="input-field"
              type="text"
              placeholder="Category Title"
              required="true"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="image">Category Cover Image</label>
            <input
              className="input-field file-input"
              type="file"
              accept="image/*"
              required="true"
              onChange={handleImageUpload}
            />
          </div>
          <button className="submit-button" type="submit">
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewCategoryModal;
