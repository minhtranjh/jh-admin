import React from "react";
import "./NavItem.css";
import { NavLink } from "react-router-dom";
const NavItem = ({ label, icon, path,index }) => {
  return (
    <li className="navItem">
      <NavLink  exact activeClassName="isActiveLink" to={path} className="navLink">
        <p className="navLabel">{label}</p>
        {icon}
      </NavLink>
    </li>
  );
};

export default NavItem;
