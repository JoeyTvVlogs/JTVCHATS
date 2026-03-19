import { db } from "./firebase.js";
import { ref, get, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔒 als al ingelogd → naar chat
if(localStorage.getItem("user")){
  window.location.href = "index.html";
}

const usernameInput = document.getElementById("username");

window.login = async function(){
  const user = usernameInput.value.trim().toLowerCase();

  if(!user) return alert("Username nodig");

  const userRef = ref(db, "users/" + user);
  const snapshot = await get(userRef);

  if(!snapshot.exists()){
    const confirmCreate = confirm("Account bestaat niet. Aanmaken?");
    if(!confirmCreate) return;
    await set(userRef, true);
  }

  localStorage.setItem("user", user);
  window.location.href = "index.html";
}
