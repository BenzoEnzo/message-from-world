import React, { useState, useEffect } from 'react';
import { getUserById, updateUser } from '../apiService';
import { UserDTO } from '../shared/dto/dtos';

function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserById(userId);

                /** @type {UserDTO} */
                const userData = response.data;
                setUser(userData);
            } catch (error) {
                setError('User not found.');
            }
        };
        fetchUser();
    }, [userId]);

    const handleUpdateUser = async () => {
        try {
            const response = await updateUser(user.id, user);

            /** @type {UserDTO} */
            const updatedUser = response.data;
            setUser(updatedUser);
        } catch (error) {
            setError('Error updating user.');
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>User Profile</h2>
            <input
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
            <input
                type="text"
                value={user.mail}
                onChange={(e) => setUser({ ...user, mail: e.target.value })}
            />
            <input
                type="text"
                value={user.country}
                onChange={(e) => setUser({ ...user, country: e.target.value })}
            />
            <button onClick={handleUpdateUser}>Update Profile</button>
        </div>
    );
}

export default UserProfile;