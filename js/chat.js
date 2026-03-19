import { db } from "./firebase.js";
import { ref, push, onChildAdded, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const messages = document.getElementById("messages");
const chatHeader = document.getElementById("chatHeader");
const msgInput = document.getElementById("msg");

let currentChat = null;

window.startChat = async function(){
 const other = prompt("Username")?.toLowerCase();
 if(!other) return;

 const snap = await get(ref(db,"users/"+other));
 if(!snap.exists()) return alert("User bestaat niet");

 const user = localStorage.getItem("user");
 currentChat = [user, other].sort().join("_");

 chatHeader.innerText = "Chat met " + other;

 messages.innerHTML = "";

 onChildAdded(ref(db,"chats/"+currentChat), data=>{
   const msg = data.val();
   const div = document.createElement("div");
   div.className = "message";

   if(msg.user === user) div.classList.add("mine");

   div.innerText = msg.user + ": " + msg.text;
   messages.appendChild(div);
 });
}

window.send = function(){
 const text = msgInput.value;
 const user = localStorage.getItem("user");

 if(!text || !currentChat) return;

 push(ref(db,"chats/"+currentChat), { user, text });
 msgInput.value="";
}
