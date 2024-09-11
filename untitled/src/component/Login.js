import React, { useState } from "react";
import { login, register } from "../apiService";
import { AuthorizationDTO, SignInDTO, UserDTO } from "../shared/dto/dtos";
import { useNavigate } from "react-router-dom";
import '../style/Login.css';

function Login({ onLoginSuccess }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState(null);
    const [clientAppId] = useState('myAppId'); // Example clientAppId, adjust as needed
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

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

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        /** @type {Omit<UserDTO, 'id' | 'points' | 'role' | 'createdAt' | 'lastLoggedAt' | 'deprecate'>} */
        const registrationData = {
            username,
            mail,
            password,
            country,
            clientAppId,
        };

        try {
            await register(registrationData);
            setIsRegistering(false);
            setError(null);
        } catch (error) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="formContainer">
                <div className="toggle-buttons">
                    <button
                        className={`toggle-button ${!isRegistering ? 'active' : ''}`}
                        onClick={() => setIsRegistering(false)}
                    >
                        Login
                    </button>
                    <button
                        className={`toggle-button ${isRegistering ? 'active' : ''}`}
                        onClick={() => setIsRegistering(true)}
                    >
                        Register
                    </button>
                </div>

                {isRegistering ? (
                    <form onSubmit={handleRegisterSubmit} className="form">
                        <h2 className="title">Create an Account</h2>
                        {error && <p className="errorText">{error}</p>}
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="input"
                        />
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
                        <input
                            type="text"
                            placeholder="Country Code"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                            className="input"
                        />
                        <button type="submit" className="button">Sign-up</button>
                    </form>
                ) : (
                    <form onSubmit={handleLoginSubmit} className="form">
                        <h2 className="title">Welcome Back</h2>
                        {error && <p className="errorText">{error}</p>}
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
                        <button type="submit" className="button">Sign-in</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Login;