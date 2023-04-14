import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Axios from 'axios'
import './index.css'

function Register() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()


    const updateUsername = (event) => {
        setUsername(event.target.value)
    }

    const updatePassword = (event) => {
        setPassword(event.target.value)
    }

    const submitForm = async (event) => {
        event.preventDefault()
        if (username.length === 0) {
            alert("Username is required")
        }
        else {
            if (password.length === 0) {
                alert("Please type your password")
            }
            else {
                try {
                    const response = await Axios.post("http://localhost:3000/register", {
                        username: username,
                        password: password,
                    });
                    if (response.data !== "Username already Exists") {
                        Cookies.set("jwtToken", response.data)
                        navigate("/transactions")
                    }
                    else {
                        alert(response.data)
                    }

                }
                catch (error) {
                    console.log(error)
                }
            }
        }   
 }


    return (
        <form className="login-bg" onSubmit={submitForm} >
            <h1>Register</h1>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" onChange={updateUsername} />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={updatePassword} />
            <button type="submit">SUBMIT</button>
        </form>
    )

}

export default Register