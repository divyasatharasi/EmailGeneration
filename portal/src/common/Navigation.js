import React from 'react';
import { Navbar, Nav, NavItem, Container } from 'react-bootstrap';
import Registration from '../views/registration/Registration'
import Login from '../views/registration/Login'
import ResetPassword from '../views/registration/ResetPassword'
import ChangePassword from '../views/registration/ChangePassword'
import Home from '../views/home/Home'
import FileUpload from '../views/home/FileUpload'
import ViewCustomerList from '../views/home/ViewCustomerList'

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
              <Nav.Link to={"/register"} className="nav-link" as={Registration}>
              </Nav.Link>
            </li> }
            {!isLoggedIn &&
            <NavItem eventkey={1} href={"/login"}>
              <Nav.Link to={"/login"} className="nav-link" as={Login}>
                Login
              </Nav.Link>
              </NavItem>
            }
            {!isLoggedIn &&  <li className="nav-item">
              <Nav.Link to={"/reset-password"} className="nav-link" as={ResetPassword}>
                Reset Password
              </Nav.Link>
            </li>}
            {isLoggedIn && <li className="nav-item">
              <Nav.Link to={"/change-password"} className="nav-link" as={ChangePassword}>
                Change Password
              </Nav.Link>
            </li> }
            {isLoggedIn && isAdmin && <li className="nav-item">
              <Nav.Link to={"/customer-list"} className="nav-link" as={ViewCustomerList}>
              View Customer List
              </Nav.Link>
            </li> }
            {isLoggedIn && <li className="nav-item">
              <Nav.Link to={"/file-upload"} className="nav-link" as={FileUpload}>
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