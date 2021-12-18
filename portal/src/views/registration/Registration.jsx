import React, { useState } from 'react'
import axios from 'axios';
import authHeader from '../../common/authHeader';
import { Button,Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './Registration.css'

const FIELDS = {
    'first_name': "First name",
    'last_name': "Last name",
    'email': "Email"
}


export default function Registration() {

    let [registrationData, setRegistrationData] = useState('');
    let [errorMessage, setErrorMessage] = useState('');
    let [message, setMessage] = useState('');
    let [showModal, setShowModal] = useState(false);
    
    const hasMandatoryfields = () => {
        let res = true;
        const emptyField = Object.keys(FIELDS).find( a => registrationData[a] == undefined || registrationData[a] === '');
        if (emptyField) {
            setErrorMessage(`${FIELDS[emptyField]} is mandatory`)
            return false;
        }
        return res;
    }

    const registerUser = () => {
        if (registrationData === '') {
            setErrorMessage("All fields are mandatory!")
        } else {
            if(hasMandatoryfields()) {
                axios.post("http://localhost:8080/api/register", {  ...registrationData }, {headers: authHeader()})
                .then((response) => {
                    const data = response.data;
                    if(data.success) {
                        setErrorMessage('');
                        setShowModal(!showModal);
                        setMessage(data.message);
                    } else {
                        setErrorMessage(data.message)
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
        
    }

    const onInputValueChange = (event) => {
        if(event.target.name === "is_admin") {
            setRegistrationData({...registrationData, [event.target.name]: event.target.checked})
        } else {
            setRegistrationData({...registrationData, [event.target.name]: event.target.value})
        }
    }

    const handleModal = () => {  
        setShowModal(!showModal);
    }

    return (
        <div className="wrapper">
            <div className="registration-fields">
                <p>First Name</p>
                <input type="text" name="first_name" onChange={(event) => onInputValueChange(event)} />
            </div>
            <div className="registration-fields">
                <p>Last Name</p>
                <input type="text" name="last_name" onChange={(event) => onInputValueChange(event)} />
            </div>
            <div className="registration-fields">
                <p>Email Id</p>
                <input type="email" name="email" onChange={(event) => onInputValueChange(event)} />
            </div>
            <div style={{"width": "25vh", "padding": "10px 0"}} className="registration-fields">
               <p> <input type="checkbox" name="is_admin" value="isAdmin" onChange={(event) => onInputValueChange(event)} /> Is admin</p>
                <button type="button" onClick={registerUser} className='btn btn-primary'>Register</button>
            </div>

            {errorMessage && <div  style={{"width": "100vh", "justifyContent": "center"}} className="registration-fields"><p style={{"color": "red"}}>{errorMessage}</p></div>}

            <Modal show={showModal} onHide={()=>handleModal()}>  
            <Modal.Body>{message}</Modal.Body>  
            <Modal.Footer>  
                <Button onClick={()=>handleModal()}>Close</Button>  
            </Modal.Footer>  
            </Modal> 
        </div>
    )
}