import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./NotifyDialog.css";
const NotifyDialog = ({ message, error }) => {
  const [isOpen,setIsOpen] = useState(false)
  useEffect(() => {
    if(message){
      setIsOpen(true)
    }
  },[message])
  return (
    <div className={`notifyDialog ${isOpen ? "isOpen" : ""}`}>
      <div className="messageBox">
        <div className="messageIcon">
          <i class="fas fa-check"></i>
        </div>
        <p>{message ? message : ""}</p>
        <button onClick={()=>setIsOpen(false)} className="messageBtn">Ok</button>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default NotifyDialog;
