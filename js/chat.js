import { db } from "./firebase.js";
import { ref, push, onChildAdded, get, off } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔒 AUTH CHECK
const currentUser = localStorage.getItem("user");

if(!currentUser){
  window.location.href = "login.html";
}

// ELEMENTS
const messages = document.getElementById("messages");
const chatHeader = document.getElementById("chatHeader");
const msgInput = document.getElementById("msg");
const chatList = document.getElementById("chatList");

let currentChat = null;
let currentListener = null;

// START CHAT
window.startChat = async function(){
  const other = prompt("Username")?.toLowerCase();
  if(!other) return;

  const snap = await get(ref(db, "users/" + other));
  if(!snap.exists()) return alert("User bestaat niet");

  let saved = JSON.parse(localStorage.getItem("savedChats") || "[]");

  if(!saved.includes(other)){
    saved.push(other);
    localStorage.setItem("savedChats", JSON.stringify(saved));
  }

  openChat(other);
  loadSavedChats();
}

// OPEN CHAT
function openChat(other){
  currentChat = [currentUser, other].sort().join("_");
  chatHeader.innerText = "Chat met " + other;
  loadMessages();
}

// LOAD MESSAGES
function loadMessages(){
  if(currentListener) off(currentListener);

  messages.innerHTML = "";

  const chatRef = ref(db, "chats/" + currentChat);
  currentListener = chatRef;

  // oude berichten
  get(chatRef).then(snapshot => {
    snapshot.forEach(child => {
      renderMessage(child.val());
    });
  });

  // nieuwe berichten
  onChildAdded(chatRef, data => {
    renderMessage(data.val());
  });
}

// RENDER
function renderMessage(msg){
  const div = document.createElement("div");
  div.className = "message";

  if(msg.user === currentUser){
    div.classList.add("mine");
  }

  div.innerText = msg.user + ": " + msg.text;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// SEND
window.send = function(){
  const text = msgInput.value;
  if(!text || !currentChat) return;

  push(ref(db, "chats/" + currentChat), {
    user: currentUser,
    text
  });

  msgInput.value = "";
}

// LOAD CHAT LIST
function loadSavedChats(){
  chatList.innerHTML = "";

  const saved = JSON.parse(localStorage.getItem("savedChats") || "[]");

  saved.forEach(user => {
    const div = document.createElement("div");
    div.innerText = user;
    div.onclick = () => openChat(user);
    chatList.appendChild(div);
  });
}

// LOGOUT
window.logout = function(){
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// INIT
loadSavedChats();
