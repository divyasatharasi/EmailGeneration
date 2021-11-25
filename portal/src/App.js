import "bootstrap/dist/css/bootstrap.min.css";
import {
  Switch,
  Route,
  Link
} from "react-router-dom";
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import './App.css';
import Registration from './views/registration/Registration'
import Login from './views/registration/Login'
import ResetPassword from './views/registration/ResetPassword'
import ChangePassword from './views/registration/ChangePassword'
import Home from './views/home/Home'
import FileUpload from './views/home/FileUpload'
import PrivateRoute from './common/privateRoute';

function App() {
  const location = useLocation();
  const history = useHistory();
  const { isLoggedIn } = useSelector((state) => state.auth)

  const handleLogout = () => {
    localStorage.clear();
    history.push("/");
  } 

  return (
    <div className="App">
      <header className="App-header">Customer Email Id Generation Portal </header>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <div className="navbar-nav mr-auto">
          {!isLoggedIn && <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Registration
              </Link>
            </li> }
            {!isLoggedIn && (location.pathname.includes('reset') ? <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li> : <li className="nav-item">
              <Link to={"/reset-password"} className="nav-link">
                Reset Password
              </Link>
            </li>)}
            {isLoggedIn && <li className="nav-item">
              <Link to={"/change-password"} className="nav-link">
                Change Password
              </Link>
            </li> }
            {isLoggedIn && <li className="nav-item">
              <Link className="nav-link" onClick={handleLogout}>
                Logout
              </Link>
            </li> }
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/login"]}> <Login /> </Route>
            <Route exact path="/register"> <Registration /> </Route>
            <PrivateRoute exact path="/home" component={Home} authed={isLoggedIn} />
            <PrivateRoute exact path="/change-password" component={ChangePassword} authed={isLoggedIn} />
            <PrivateRoute exact path="/file-upload" component={FileUpload} authed={isLoggedIn} />
            <Route exact path="/reset-password"> <ResetPassword /> </Route>
          </Switch>
        </div>
      </div>
  );
}

export default App;
