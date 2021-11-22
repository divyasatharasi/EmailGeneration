
import React, {useState} from 'react'
import { useHistory } from "react-router-dom";
import axios from 'axios';

const ChangePassword = (props) => {
    
    let [inputData, setInputData] = useState('');
    const history = useHistory();
    const updatePassword = () => {
        axios.post("http://localhost:8080/user/updatePassword", {  ...inputData })
        .then((response) => {
            console.log("change password response data : ", response.data)
            history.push("/login");
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const onInputValueChange = (event) => {
        console.log(event.target.name, event.target.value);
        setInputData({...inputData, [event.target.name]: event.target.value})
    }

  return (
    <div  className="form-change-password">
        <div>
        <p>Current Password</p>
      <input name="currentPassword"
             type="password"
             placeholder="Current Password"
             onChange={(event) => onInputValueChange(event)}
      /></div>
      <div>
      <p>New Password</p>
      <input name="newPassword"
             type="password"
             placeholder="New Password"
             onChange={(event) => onInputValueChange(event)}
      /></div>
      <div>
      <p>Confirm New Password</p>
      <input name="newPasswordRepeated"
             type="password"
             placeholder="New Password Repeated"
             onChange={(event) => onInputValueChange(event)}
      /></div>
      <div>
      <button type="button"
               class="btn btn-primary"
               onClick={updatePassword}
      >
        Change Password
      </button>
      </div>
    </div>
  );

};

export default ChangePassword;