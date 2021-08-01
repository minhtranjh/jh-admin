import React from "react";
import "./AuthenticateLayout.css";
import logoWhite from "../../assets/images/logo-white.png";
function AuthenticateLayout({ children,title }) {
  return (
    <div className="authLayout">
      <div className="authBackground">
        <div className="greenBackground"></div>
        <div className="lightBackground"></div>
      </div>
      <div className="authContainer">
        <div className="authLogo">
          <img src={logoWhite} alt="" />
          <p>Journey Horizon</p>
        </div>
        <div className="authSideBackground">
          <div className="authTitle">{title}</div>
        </div>
        <div className="authForm">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthenticateLayout;
