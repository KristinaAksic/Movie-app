import React from "react";
import "../Modal.css";

const Modal = ({ data, onClose }) => {
  if (!data) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <img src={data.Poster} alt={data.Title} />
        <h2>{data.Title}</h2>
        <p>{data.Year}</p>
      </div>
    </div>
  );
};

export default Modal;
