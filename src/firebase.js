import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.FirebaseKey,
    authDomain: "eduverse-aa2e0.firebaseapp.com",
    projectId: "eduverse-aa2e0",
    storageBucket: "eduverse-aa2e0.appspot.com",
    messagingSenderId: "522969778102",
    appId: "1:522969778102:web:01f03c9b6571c978206317"
  };

  const app = initializeApp(firebaseConfig);
  export default app;