import React from "react";
import Container from "../Container/Container";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";

const Layout = ({ children }) => {
  return (
    <>
      <Sidebar />
      <Topbar/>
      <Container>
        {children}
      </Container>
    </>
  );
};

export default Layout;
