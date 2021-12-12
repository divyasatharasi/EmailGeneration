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
            
          {isLoggedIn && location.pathname != "/register" && isAdmin  && <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Registration
              </Link>
            </li> }
            {!isLoggedIn  && location.pathname != "/login" && <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li> }
            {!isLoggedIn  && location.pathname != "/reset-password" &&  <li className="nav-item">
              <Link to={"/reset-password"} className="nav-link">
                Reset Password
              </Link>
            </li>}
            {isLoggedIn && location.pathname != "/change-password" && <li className="nav-item">
              <Link to={"/change-password"} className="nav-link">
                Change Password
              </Link>
            </li> }
            {isLoggedIn && location.pathname != "/customer-list" && isAdmin && <li className="nav-item">
              <Link to={"/customer-list"} className="nav-link">
              View Customer List
              </Link>
            </li> }
            {isLoggedIn && location.pathname != "/file-upload" && <li className="nav-item">
              <Link to={"/file-upload"} className="nav-link">
              Data Upload
              </Link>
            </li> }
            {isLoggedIn && <div className="logout-wrapper"> <div style={{color: "white"}}> Welcome, {userName} </div>
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
