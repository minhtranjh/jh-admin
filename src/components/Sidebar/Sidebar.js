import React from "react";
import "./Sidebar.css";
import logoWhite from "../../assets/images/logo-white.png";
import NavItem from "../NavItem/NavItem";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { logOutWithFirebase } from "../../redux/actions/auth";
const listNavItem = [
  {
    label : "Dashboard",
    path : "/",
    icon : <i className="fas fa-tachometer-alt"></i>
  },
  {
    label: "Member",
    path: "/member",
    icon: <i className="far fa-user"></i>,
  },
  {
    label: "Position",
    path: "/position",
    icon: <i className="fas fa-crosshairs"></i>,
  },
  {
    label: "Team",
    path: "/team",
    icon: <i className="fas fa-users"></i>,
  },
  {
    label: "User",
    path: "/user",
    icon: <i className="fas fa-user"></i>,
  },
];
const Sidebar = () => {
  const dispatch = useDispatch()
  const handleLoggingout = ()=>{
    dispatch(logOutWithFirebase())
  }
  return (
    <div className="sideBar">
      <div className="logoArea">
        <img src={logoWhite} alt="" />
      </div>
      <ul className="navList">
        {listNavItem.map((item, index) => (
          <NavItem
            key={item.label}
            index={index}
            label={item.label}
            path={item.path}
            icon={item.icon}
          />
        ))}
      </ul>
      <button onClick={handleLoggingout} className="logOutBtn">
        <p>Log out</p>
        <i className="fas fa-sign-out-alt"></i>
      </button>
    </div>
  );
};

export default Sidebar;
