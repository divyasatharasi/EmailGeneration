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
      <Navigation isLoggedIn={isLoggedIn} pathname={location.pathname} isAdmin={isAdmin} userName={userName} handleLogout={handleLogout} />

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
