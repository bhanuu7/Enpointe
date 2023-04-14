import { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
// import Register from '../Register'
import Axios from 'axios'
import './index.css'

function Login () {
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    

    const updateUsername = (event) => {
        setUsername(event.target.value)
    }

    const updatePassword = (event) => {
        setPassword(  event.target.value )
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
                    const response = await Axios.post("http://localhost:3000/login", {
                        username: username,
                        password: password,
                    });
                    const { token } = response.data
                    Cookies.set("jwtToken", token)
                    if (response.data.role === "customer") {
                        navigate("/transactions")
                    }
                    else if (response.data.role === "banker") {
                        navigate("/accounts")
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
                <h1>Login</h1>
                <div className="input-label">          
                <label htmlFor="username">Username</label>
                 <input type="text" id="username" onChange={updateUsername} className="input"/>
                </div>
                <div className="input-label">
                <label htmlFor="password">Password</label>
                    <input type="password" id="password" onChange={updatePassword} className="input" />
                </div>
                <button type="submit" className="submit-button">LOGIN</button>
                <p>Didn't have an account? click here to <Link to="/register">sign-up</Link></p>
            </form>
        )
}

export default Login