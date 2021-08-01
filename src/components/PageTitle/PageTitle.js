import React from "react";
import "./PageTitle.css";
const PageTitle = ({ title, icon, background, description }) => {
  return (
    <div
      className="pageTitle"
      style={{ backgroundImage: `url(${background})` }}
    >
      {icon}
      <div className="title">
        <p>{title}</p>
        <span>{description}</span>
      </div>
    </div>
  );
};

export default PageTitle;
