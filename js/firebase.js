// /js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBb06Iy099KXsfoBLsMhH0dohlKGQW30-E",

  authDomain: "chat-app-joey.firebaseapp.com",

  databaseURL: "https://chat-app-joey-default-rtdb.europe-west1.firebasedatabase.app/",

  projectId: "chat-app-joey",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
