import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Auth.css';

export const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    const isPasswordStrong = (password) => {
        // Regular expression for password validation
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(password);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");
        setPasswordError("");

        // Validate password strength before sending the request
        if (!isPasswordStrong(password)) {
            setPasswordError("Password must be at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character.");
            return;
        }

        axios.post("http://localhost:5029/api/auth/register", { name, email, password })
            .then(result => {
                console.log('Request successful:', result);
                navigate('/login');
            })
            .catch(err => {
                console.error('Error occurred:', err);
                if (err.response && err.response.data.message) {
                    setErrorMessage(err.response.data.message);
                } else {
                    setErrorMessage("An unexpected error occurred. Please try again.");
                }
            });
    };

    return (
       <>
         <div className="login-box">
            <p>Register</p>
            <form onSubmit={handleSubmit}>
                <div className="user-box">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={errorMessage ? "input-error" : ""}
                        required
                    />
                    <label>Name</label>
                </div>

                <div className="user-box">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={errorMessage ? "input-error" : ""}
                        required
                    />
                    <label>Email</label>
                </div>

                <div className="user-box">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={(errorMessage || passwordError) ? "input-error" : ""}
                        required
                    />
                    <label>Password</label>
                </div>

                {passwordError && <p className="error-message">{passwordError}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Submit
                </button>
            </form>
            <p>If you have an account, <a href="/login" className="a2">Login!</a></p>
         </div>
       </>
    );
};
