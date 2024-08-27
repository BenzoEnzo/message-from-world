import React, { useState } from 'react';
import { register } from '../apiService';

import { UserDTO } from '../shared/dto/dtos';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        mail: '',
        password: '',
        country: '',
        clientAppId: '',
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // You can reference DTOs here
        /** @type {Omit<UserDTO, 'id' | 'points' | 'role' | 'createdAt' | 'lastLoggedAt' | 'deprecate'>} */
        const dataToSubmit = formData;

        try {
            await register(dataToSubmit);
            setSuccess(true);
        } catch (error) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            {success ? <p>Registration successful!</p> : null}
            {error && <p>{error}</p>}
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="mail"
                placeholder="Email"
                value={formData.mail}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="country"
                placeholder="Country Code"
                value={formData.country}
                onChange={handleChange}
                required
            />
            <button type="submit">Register</button>
        </form>
    );
}

export default Register;