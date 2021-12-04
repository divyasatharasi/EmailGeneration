
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import axios from 'axios';
import authHeader from '../../common/authHeader';

const ChangePassword = (props) => {
    
    let [inputData, setInputData] = useState('');
    const history = useHistory();

	const { isLoggedIn, user} = useSelector((state) => state.auth)

    const updatePassword = () => {
        axios.post("http://localhost:8080/api/updatePassword", {  ...inputData, email: user.email }, {headers: authHeader()})
        .then((response) => {
            console.log("change password response data : ", response.data)
			const apiResponse = response.data;
            if(!apiResponse.error) {
				history.push("/login");
			} else {
				console.log(" Error occurred : ", apiResponse.message)
			}
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
			<div className="change-password-fields">
				<p>Current Password</p>
				<input name="currentPassword"
						type="password"
						placeholder="Current Password"
						onChange={(event) => onInputValueChange(event)}
				/>
			</div>
			<div className="change-password-fields">
				<p>New Password</p>
				<input name="newPassword"
						type="password"
						placeholder="New Password"
						onChange={(event) => onInputValueChange(event)}
				/>
			</div>
			<div className="change-password-fields">
				<p>Confirm New Password</p>
				<input name="newPasswordRepeated"
						type="password"
						placeholder="New Password Repeated"
						onChange={(event) => onInputValueChange(event)}
				/>
			</div>
			<div className="change-password-button">
				<button type="button"
					className="btn btn-primary"
					onClick={updatePassword}
					>
					Change Password
				</button>
			</div>
		</div>
	);
};

export default ChangePassword;