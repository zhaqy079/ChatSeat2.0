import chatIcon from "../assets/icons/icons8-chat-24.png";
import { useState } from "react";

export default function HomePMBtn({ onOpen }) {
    return (
        <button className="btn chat-btn d-flex align-items-center gap-2" onClick={onOpen}>
            <img src={chatIcon} alt="" className="icon" aria-hidden="true" />
            <span>Have a Chat</span>
        </button>
    );
}

