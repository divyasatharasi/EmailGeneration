import React, { useState } from 'react'
import axios from 'axios';
import './Registration.css'
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux'
// import { decrementCounter, incrementCounter } from '../../reducers/auth'

export default function Login() {

    let [loginData, setResponseData] = useState('');
    const history = useHistory();
    const dispatch = useDispatch()
    const authenticateUser = () => {
        axios.post("http://localhost:8080/user/login", {  ...loginData })
        .then((response) => {
            console.log("login data : ", response.data)
            // dispatch(incrementCounter());
            history.push("/home");
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const onInputValueChange = (event) => {
        console.log(event.target.name, event.target.value);
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
            <div style={{"width": "25vh", "justify-content": "center", "padding": "10px 0"}} className="registration-fields">
                <button onClick={authenticateUser}>Login</button>
            </div>
        </div>
    )
}