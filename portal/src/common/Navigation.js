import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
// import {
//     Switch,
//     Route,
//     Link
//   } from "react-router-dom";

export default function Navigation ({isLoggedIn, pathname, isAdmin, userName, handleLogout}) {

    return (
        <Navbar bg="light" expand="lg">
        <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="navbar navbar-expand navbar-dark bg-dark navigation-bar">
                {/* <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#link">Link</Nav.Link> */}

            {isLoggedIn && isAdmin  && <li className="nav-item">
              <Nav.Link to={"/register"} className="nav-link">
                Registration
              </Nav.Link>
            </li> }
            {!isLoggedIn && <li className="nav-item">
              <Nav.Link to={"/login"} className="nav-link">
                Login
              </Nav.Link>
            </li> }
            {!isLoggedIn &&  <li className="nav-item">
              <Nav.Link to={"/reset-password"} className="nav-link">
                Reset Password
              </Nav.Link>
            </li>}
            {isLoggedIn && <li className="nav-item">
              <Nav.Link to={"/change-password"} className="nav-link">
                Change Password
              </Nav.Link>
            </li> }
            {isLoggedIn && isAdmin && <li className="nav-item">
              <Nav.Link to={"/customer-list"} className="nav-link">
              View Customer List
              </Nav.Link>
            </li> }
            {isLoggedIn && <li className="nav-item">
              <Nav.Link to={"/file-upload"} className="nav-link">
              Data Upload
              </Nav.Link>
            </li> }
            {isLoggedIn && <div className="logout-wrapper"> <div style={{color: "white"}}> Welcome, {userName} </div>
             <li className="nav-item logout">
              <Nav.Link className="nav-link" onClick={handleLogout}>
                Logout
              </Nav.Link>
            </li> </div>}

            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}