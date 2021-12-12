import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './Registration.css'
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux'

export default function Login() {
    let [loginData, setResponseData] = useState('');
    let [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();
    const dispatch = useDispatch()

    const authenticateUser = () => {
        axios.post("http://localhost:8080/api/login", {  ...loginData })
        .then((response) => {
            console.log("login api response : ", response)
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
                dispatch({type: "LOGIN_SUCCESS", payload: { ...response.data.user}});
                history.push(`/${response.data.redirect}`);
            } else {
                setErrorMessage(response.data.message)
            }
            
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const onInputValueChange = (event) => {
        setResponseData({...loginData, [event.target.name]: event.target.value})
    }

    return(
        <div className="wrapper">
            <div className="registration-fields">
                <p>Email Id</p>
                <input name="email" type="email" onChange={(event) => onInputValueChange(event)} />
            </div>
            <div className="registration-fields">
                <p>Password</p>
                <input name="password" type="password" onChange={(event) => onInputValueChange(event)} />
            </div>
            {errorMessage && <div  style={{"width": "100vh", "justifyContent": "center"}} className="registration-fields"><p style={{"color": "red"}}>{errorMessage}</p></div>}
            <div style={{"width": "25vh", "justifyContent": "center", "padding": "10px 0"}} className="registration-fields">
                <button onClick={authenticateUser}>Login</button>
            </div>
        </div>
    )
}