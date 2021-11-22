import React, { useState } from 'react'
import axios from 'axios';
import './Registration.css'

export default function Registration() {

    let [registrationData, setRegistrationData] = useState('');
    
    const registerUser = () => {
        axios.post("http://localhost:8080/user/register", {  ...registrationData })
        .then((response) => {
            console.log("data : ", response.data)
            console.log("input : ", registrationData)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const onInputValueChange = (event) => {
        console.log(event.target.name, event.target.value, event.target.checked);
        if(event.target.name === "is_admin") {
            setRegistrationData({...registrationData, [event.target.name]: event.target.checked})
        } else {
            setRegistrationData({...registrationData, [event.target.name]: event.target.value})
        }
    }

    return(
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
                <button onClick={registerUser}>Register</button>
            </div>
        </div>
    )
}