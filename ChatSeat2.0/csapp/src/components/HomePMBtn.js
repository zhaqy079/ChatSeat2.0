import chatIcon from "../assets/icons/icons8-envelope-dots-48.png";
import { useState } from "react";

export default function HomePMBtn({ onOpen }) {
    return (
        <button className="chat-btn chat-btn-floating" onClick={onOpen}>
            <img src={chatIcon} alt="" className="icon" aria-hidden="true" />
            <span>Have a Chat</span>
        </button>
    );
}

// Notes: Icon reference I want to add into reference footer at the home page
// envelope: <a target="_blank" href="https://icons8.com/icon/Arv3auvWlzVK/envelope-dots">Envelope Dots</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
// chat:<a target="_blank" href="https://icons8.com/icon/Yfa6hvsbKTIy/chat-bubble">Chat</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>