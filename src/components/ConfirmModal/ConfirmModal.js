import React from "react";
import "./ConfirmModal.css";
const ConfirmModal = ({ message, confirmState, onConfirm, onCancel }) => {
  return (
    <>
      {confirmState && (
        <div className="confirmModal">
          <div className="confirmBox">
            <p>{message}</p>
            <div className="confirmBtn">
              <button onClick={() => onConfirm()}>Yes</button>
              <button onClick={() => onCancel()}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmModal;
