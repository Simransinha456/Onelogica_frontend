import React, { useState } from "react";
import axios from "axios";
import app from "../firebase";
import { getStorage } from "firebase/storage";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "../style/NewLessonModal.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewLessonModal = ({ onClose, course, currentUser }) => {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState("");
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !video || !content) {
      return;
    }

    try {
      const userData = await JSON.parse(localStorage.getItem(process.env.USER_LOCALSTORAGE_KEY));
      const response = await axios.post(
        `https://onelogica-backend.vercel.app/api/lesson/createlesson/${course._id}`,
        {
          title,
          video,
          content,
        },
        { headers: { Authorization: `Bearer ${userData.data.token}` } }
      );

      console.log("New lesson created:", response.data);
      toast.success(
        `${title}: New Lesson Created Successfully`,
        toastOptions
      );
      onClose();
    } catch (error) {
      console.error("Error creating new lesson:", error);
    }
  };

  const uploadVideoToFirebase = (file) => {
    const storageRef = getStorage(app);
    const videoRef = ref(
      storageRef,
      `lesson_videos/${course?.title}/${title + Date.now()}`
    );

    setUploading(true);

    const uploadTask = uploadBytesResumable(videoRef, file);


    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading Lesson Video:", error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            setVideo(url);
            console.log("Lesson Video uploaded to Firebase:", url);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          })
          .finally(() => {
            setUploading(false);
          });
      }
    );
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    uploadVideoToFirebase(file);
  };

  return (
    <div className="new-lesson-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Lesson Title</label>
            <input
              className="input-field"
              type="text"
              placeholder="Lesson Title"
              required={true}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="video">Lesson Video</label>
            <input
              className="input-field file-input"
              type="file"
              accept="video/*"
              required={true}
              onChange={handleVideoUpload}
            />
          </div>
          <div>
            <label htmlFor="content">Lesson Content</label>
            <textarea
              className="input-field"
              placeholder="Lesson Content"
              required={true}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button className="submit-button" type="submit" disabled={uploading}>
            {uploading
              ? `Uploading...${uploadProgress.toFixed(2)}%`
              : "Create Lesson"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewLessonModal;
