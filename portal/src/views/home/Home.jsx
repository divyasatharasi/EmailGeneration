import React from 'react'
import { useSelector } from 'react-redux'

export default function Home() {
    const user = useSelector((state) => state.user) || 'User'

    return(
        <div className="wrapper">
            Welcome {user}
        </div>
    )
}