import React, {useState} from 'react'
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux'
import axios from 'axios';
import { Button,Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './Registration.css';

export default function ResetPassword() {

    let [inputData, setInputData] = useState('');
    let [errorMessage, setErrorMessage] = useState('');
    let [showModal, setShowModal] = useState(false);

    const history = useHistory();
    const dispatch = useDispatch()
    const resetPassword = () => {
        axios.post("http://localhost:8080/api/resetPassword", {  ...inputData })
        .then((response) => {
            console.log("reset password response data : ", response.data)
            if (response && response.data && !response.data.error) {
                setShowModal(!showModal)
            } else {
                const err = response && response.data && response.data.message ? response.data.message : "Something went wrong!!"
                setErrorMessage(err)
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

    return(
        <div className="reset-wrapper">
            <div style={{height: "100px"}} className="reset-fields">
                <p>  Registered Email </p>
                <input type="email" name="email" onChange={(event) => onInputValueChange(event)}/>
            </div>
            {errorMessage && <div  style={{"width": "100vh", "justifyContent": "center"}} className="registration-fields"><p style={{"color": "red"}}>{errorMessage}</p></div>}
            <button type="button" className="btn btn-primary" onClick={resetPassword}>Reset Password</button>
            
            <Modal show={showModal} onHide={()=>handleModal()}>  
            <Modal.Body>OTP has been sent to your mail, please login with received OTP</Modal.Body>  
            <Modal.Footer>  
                <Button onClick={()=>handleModal()}>Close</Button>  
            </Modal.Footer>  
            </Modal>  
        </div>
    )
}



