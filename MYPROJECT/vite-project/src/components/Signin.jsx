import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Auth.css';

export const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 
    const [message, setMessage] = useState(''); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 

        try {
            const res = await axios.post("http://localhost:5029/api/auth/login", { email, password });
            localStorage.setItem('token', res.data.token);
            console.log('Request successful:', res);
            setMessage('Login successful');
            setError('');
            navigate('/home'); 
        } catch (err) {
            console.error('Error occurred:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message); 
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
       <>
         <div className="login-box">
            <p>Login</p>
            <form onSubmit={handleSubmit}>
                <div className="user-box">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={error ? "input-error" : ""}
                        required
                    />
                    <label>Email</label>
                </div>

                <div className="user-box">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={error ? "input-error" : ""}
                        required
                    />
                    <label>Password</label>
                </div>

                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}

                <button>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Submit
                </button>
            </form>
            <p>Don't have an account? <a href="/signup" className="a2">Sign up!</a></p>
         </div>
       </>
    );
};
