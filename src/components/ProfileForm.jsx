import React, { useState } from "react";
import "../style/ProfilePage.css";
import { useEffect } from "react";
import axios from "axios"; // Import Axios for making HTTP requests
import app from "../firebase";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileForm = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
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
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const updateUserProfile = (userData) => {
    axios
      .put("http://localhost:5000/api/user/updateprofile", userData, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        console.log("User data updated successfully");

        const updatedUserData = {
          ...JSON.parse(localStorage.getItem(process.env.USER_LOCALSTORAGE_KEY)),
          data: userData,
        };
        localStorage.setItem(process.env.USER_LOCALSTORAGE_KEY, JSON.stringify(updatedUserData));
        window.location.reload();

      })
      .catch((error) => {
        console.error("Error updating user data:", error);
      });
  };

  const toggleEditMode = () => {
    if (editMode) {
      updateUserProfile(currentUser);
    }
    setEditMode(!editMode);
  };

  const uploadProfilePicToFirebase = (file) => {
    const storageRef = getStorage(app);
    const profilePicRef = ref(
      storageRef,
      `profile_pictures/${currentUser.email}`
    );

    uploadBytes(profilePicRef, file)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => {
        setCurrentUser({ ...currentUser, profilePic: url });
        console.log("Profile picture uploaded to Firebase:", url);
      })
      .catch((error) => {
        console.error("Error uploading profile picture:", error);
      });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    uploadProfilePicToFirebase(file);
  };

  return currentUser ? (
    <div className="profile-container">
      <div className="profile-frame">
        <img
          className="profile-image"
          src={currentUser.profilePic || "temp-image.jpg"}
          alt="Profile"
        />
      </div>
      <div>
        <label htmlFor="profilePicture">Upload Picture</label>
        <input
          type="file"
          accept="image/*"
          id="profilePicture"
          name="profilePicture"
          onChange={handleImageUpload}
          disabled={!editMode}
        />
      </div>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={currentUser.name}
          onChange={handleChange}
          className="profile-field"
          disabled={!editMode}
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={currentUser.email}
          onChange={handleChange}
          className="profile-field"
          disabled={!editMode}
        />
      </div>
      <div>
        <label htmlFor="faculty">Faculty</label>
        <input
          type="text"
          id="faculty"
          name="faculty"
          value={currentUser.faculty}
          className="profile-field"
          disabled
        />
      </div>
      <div>
        <label htmlFor="position">Position</label>
        <input
          type="text"
          id="position"
          name="position"
          value={currentUser.isTeacher ? "Teacher" : "Student"}
          onChange={handleChange}
          className="profile-field"
          disabled
        />
      </div>
      <button className="edit-button" onClick={toggleEditMode}>
        {editMode ? "Save Changes" : "Edit Profile"}
      </button>
    </div>
  ) : null;
};

export default ProfileForm;
