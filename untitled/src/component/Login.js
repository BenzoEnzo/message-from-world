import React, { useState } from "react";
import { login } from "../apiService";
import { AuthorizationDTO, SignInDTO } from "../shared/dto/dtos";

function Login({ onLoginSuccess }) {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

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
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;