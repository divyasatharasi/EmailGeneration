import React, {useState} from 'react'
import { useHistory } from "react-router-dom";
import axios from 'axios';

export default function ResetPassword() {

    let [inputData, setInputData] = useState('');
    const history = useHistory();
    const resetPassword = () => {
        axios.post("http://localhost:8080/api/resetPassword", {  ...inputData })
        .then((response) => {
            console.log("reset password response data : ", response.data)
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


    return(
        <div className="wrapper">
            <div>
                <p> Email</p>
                <input type="email" name="email" placeholder="Enter email" onChange={(event) => onInputValueChange(event)}/>
            </div>
            <button type="button" className="btn btn-primary" onClick={resetPassword}>Reset Password</button>
        </div>
    )
}



