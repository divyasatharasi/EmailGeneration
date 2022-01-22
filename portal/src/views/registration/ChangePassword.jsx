
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import axios from 'axios';
import authHeader from '../../common/authHeader';
import { Button,Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './Registration.css'

const ChangePassword = () => {
    
    const [inputData, setInputData] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [showModal, setShowModal] = useState(false);

    const history = useHistory();
	const dispatch = useDispatch();

	const { user} = useSelector((state) => state.auth)

	const validatePassword = () => {
		let isValid = true;
		if (typeof inputData["newPassword"] == "undefined" || typeof inputData["newPasswordRepeated"] == "undefined" || (inputData["newPassword"] !== inputData["newPasswordRepeated"]) ) {	
			  isValid = false;
			  setErrorMessage("Passwords don't match.")
		}
		return isValid;
	}

    const updatePassword = () => {
		const isValid = validatePassword();
		
		if(isValid) {
			axios.post("http://localhost:8080/api/updatePassword", {  ...inputData, email: user.email }, {headers: authHeader()})
			.then((response) => {
				console.log("change password response data : ", response.data)
				const apiResponse = response.data;
				if(!apiResponse.error) {
					setShowModal(!showModal)
				} else {
					console.log(" Error occurred : ", apiResponse.message)
					setErrorMessage(apiResponse.message)
				}
			})
			.catch(({response}) => {
				if (response && response.data) {
					setErrorMessage(response.data.message)
				} else {
					setErrorMessage("Something went wrong!")
				}
			})
		}        
    }

    const onInputValueChange = (event) => {
        console.log(event.target.name, event.target.value);
        setInputData({...inputData, [event.target.name]: event.target.value})
    }

	const handleModal = () => {  
        setShowModal(!showModal);
        localStorage.clear();
        dispatch({type: "LOGOUT"});
        history.push("/login");
    }

	return (
		<div className="form-change-password">
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
			{errorMessage && <div  style={{"width": "100vh", "justifyContent": "center"}} className="registration-fields"><p style={{"color": "red"}}>{errorMessage}</p></div>}
			<div className="change-password-button">
				<button type="button"
					className="btn btn-primary"
					onClick={updatePassword}
					>
					Change Password
				</button>
			</div>

			<Modal show={showModal} onHide={()=>handleModal()}>  
            <Modal.Body>Your password has been changed successfully, please login again.</Modal.Body>  
            <Modal.Footer>  
                <Button onClick={()=>handleModal()}>Close</Button>  
            </Modal.Footer>  
            </Modal> 
		</div>
	);
};

export default ChangePassword;