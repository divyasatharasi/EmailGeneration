import "bootstrap/dist/css/bootstrap.min.css";
import {
  Switch,
  Route,
  Link
} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import './App.css';
import Registration from './views/registration/Registration'
import Login from './views/registration/Login'
import ResetPassword from './views/registration/ResetPassword'
import ChangePassword from './views/registration/ChangePassword'
import Home from './views/home/Home'
import FileUpload from './views/home/FileUpload'
import ViewCustomerList from './views/home/ViewCustomerList'
import PrivateRoute from './common/privateRoute';

import Navigation from "./common/Navigation";

function App() {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch()
  const { isLoggedIn, user } = useSelector((state) => state.auth)
  const isAdmin = user && user.is_admin == 1 ? true : false;
  const userName = user && user.first_name ? `${user.first_name} ${user.last_name}` : (isAdmin ? 'Admin' : 'User' );
  
  const handleLogout = () => {
    localStorage.clear();
    dispatch({type: "LOGOUT"});
    history.push("/login");
  } 

  return (
    <div className="App">
      <header className="App-header">Customer Email Id Generation Portal </header>
      <nav className="navbar navbar-expand navbar-dark bg-dark navigation-bar">
          <div className="navbar-nav mr-auto">
            {!isLoggedIn && <li>
                <Link to={"/login"} className={location.pathname === "/login" ? "nav-link nav-link-active" : "nav-link"}>
                  Login
                </Link>
              </li> }
            {!isLoggedIn && <li>
              <Link to={"/reset-password"} className={location.pathname === "/reset-password" ? "nav-link nav-link-active" : "nav-link"}>
                Reset Password
              </Link>
            </li>}

            {isLoggedIn && <li className="nav-item">
              <Link to={"/file-upload"} className={(location.pathname === "/file-upload" || location.pathname === "/" ) ? "nav-link nav-link-active" : "nav-link"}>
              Data Upload
              </Link>
            </li> }
            {isLoggedIn && isAdmin && <li className="nav-item">
              <Link to={"/customer-list"} className={location.pathname === "/customer-list" ? "nav-link nav-link-active" : "nav-link"}>
              View Customer List
              </Link>
            </li> }
            {isLoggedIn && isAdmin  && <li className="nav-item">
              <Link to={"/register"} className={location.pathname === "/register" ? "nav-link nav-link-active" : "nav-link"}>
                Registration
              </Link>
            </li> }
            {isLoggedIn && <li>
              <Link to={"/change-password"} className={location.pathname === "/change-password" ? "nav-link nav-link-active" : "nav-link"}>
                Change Password
              </Link>
            </li> }
        
            {isLoggedIn && <div className="logout-wrapper"> <div style={{color: "dodgerblue"}}> Welcome, {userName} </div>
             <li className="nav-item logout">
              <Link className="nav-link" onClick={handleLogout}>
                Logout
              </Link>
            </li> </div>}
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path="/login"> <Login /> </Route>
            <Route exact path="/register"> <Registration /> </Route>
            <PrivateRoute exact path="/home" component={Home} authed={isLoggedIn} />
            <PrivateRoute exact path="/change-password" component={ChangePassword} authed={isLoggedIn} />
            <PrivateRoute exact path={["/", "/file-upload"]} component={FileUpload} authed={isLoggedIn} />
            <PrivateRoute exact path="/customer-list" component={ViewCustomerList} authed={isLoggedIn} />
            <Route exact path="/reset-password"> <ResetPassword /> </Route>
          </Switch>
        </div>
      </div>
  );
}

export default App;
