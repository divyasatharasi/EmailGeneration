import './App.css';
import Registration from './views/registration/Registration'
import Login from './views/registration/Login'
import ResetPassword from './views/registration/ResetPassword'
import ChangePassword from './views/registration/ChangePassword'
import Home from './views/home/Home'
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">Customer Email Id Generation Portal </header>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Registration
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/reset-password"} className="nav-link">
                Reset Password
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/change-password"} className="nav-link">
                Change Password
              </Link>
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/login"]}> <Login /> </Route>
            <Route exact path="/register"> <Registration /> </Route>
            <Route exact path="/home"> <Home /> </Route>
            <Route exact path="/reset-password"> <ResetPassword /> </Route>
            <Route exact path="/change-password"> <ChangePassword /> </Route>
          </Switch>
        </div>
      </div>
  );
}

export default App;
