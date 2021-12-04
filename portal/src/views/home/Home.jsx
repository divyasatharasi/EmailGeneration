import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios';
import authHeader from '../../common/authHeader';

export default function Home() {
    const { isLoggedIn, user} = useSelector((state) => state.auth)

    useEffect(() => {
        console.log("Home useeffect called");
        callHomeAPI();
    });

    const callHomeAPI = () => {
        axios.get("http://localhost:8080/api/home", {headers: authHeader()})
        .then((response) => {
            console.log("Home response data : ", response.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }
    
    return(
        <div className="wrapper">
            Welcome {isLoggedIn ? user.first_name : "User"}
        </div>
    )
}