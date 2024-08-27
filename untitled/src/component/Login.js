import React, { useState } from "react";
import { login } from "../apiService";
import { AuthorizationDTO, SignInDTO } from "../shared/dto/dtos";
import { useNavigate } from "react-router-dom";
import '../style/Login.css';

function Login({ onLoginSuccess }) {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // You can reference DTOs here, even though JS doesn't enforce it
        /** @type {SignInDTO} */
        const credentials = { mail, password };

        try {
            const response = await login(credentials);

            /** @type {AuthorizationDTO} */
            const authData = response.data;
            onLoginSuccess(authData.jwtToken, authData.profile);
            localStorage.setItem('jwtToken', authData.jwtToken);
            navigate('/profile');
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="container">
            <div className="formContainer">
                <h2 className="title">Welcome Back</h2>
                {error && <p className="errorText">{error}</p>}
                <form onSubmit={handleSubmit} className="form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        required
                        className="input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input"
                    />
                    <button type="submit" className="button">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;