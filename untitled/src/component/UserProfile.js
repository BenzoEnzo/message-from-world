import React, {useState} from "react";
import '../style/UserProfile.css';
import {readRandomMessage, sendMessage} from "../apiService";
import  MessageDTO from '../shared/dto/dtos';

function UserProfile({ user }) {

    const [message, setMessage] = useState(null);
    const [randomMessage, setRandomMessage] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");
    const [content, setContent] = useState("");
    const getJwtToken = () => {
        return localStorage.getItem('jwtToken');
    };

    const jwtToken = getJwtToken();


    const handleSendMessage = async () => {
        try {
            /** @type {MessageDTO} */
            const response = await sendMessage({
                "messageId": "string",
                "sendAt": "2024-08-27T21:12:05.843Z",
                "content": content,
                "profile": {
                    "id": 0,
                    "username": "string",
                    "clientAppId": "string",
                    "country": "st",
                    "password": "string",
                    "mail": "string",
                    "points": 0,
                    "role": "USER",
                    "createdAt": "2024-08-27T21:12:05.843Z",
                    "lastLoggedAt": "2024-08-27T21:12:05.843Z",
                    "deprecate": true
                },
                "metadata": {
                    "ipAddress": "string",
                    "deviceName": "string"
                },
                "reader": {
                    "id": "string",
                    "userName": "string",
                    "readTimestamp": "2024-08-27T21:12:05.843Z"
                },
                "read": true
            }, { headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }});

            /** @type {MessageDTO} */
            setResponseMessage(`Message sent: ${content}`);
            setMessage("");
        } catch (error) {
            setResponseMessage("Error sending message.");
            console.error('Error sending message:', error);
        }
    };

    const handleReadMessage = async () => {
        try {
            const response = await readRandomMessage({
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            /** @type {MessageDTO} */
            const message = response.data;
            setRandomMessage(message);
        } catch (error) {
            setRandomMessage("Error reading message.");
            console.error('Error reading message:', error);
        }
    };

    if (!user || !jwtToken) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container">
            <div className="main-content">
                <div className="message-box">
                    <h1>Message Center</h1>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your message..."
                        rows="4"
                        className="message-input"
                    />
                    <button onClick={handleSendMessage} className="button send-button">
                        Send Message
                    </button>
                    <button onClick={handleReadMessage} className="button fetch-button">
                        Get Random Message
                    </button>
                    {responseMessage && <p className="response-message">{responseMessage}</p>}
                    {randomMessage &&
                        <p className="random-message"><strong>Random Message:</strong> {randomMessage}</p>}
                </div>
            </div>
            <div className="profile-container">
                <div className="profile-card">
                    <h2>Welcome, {user.username}</h2>
                    <p><span>Email:</span> {user.mail}</p>
                    <p><span>Country:</span> {user.country}</p>
                    <p><span>Points:</span> {user.points}</p>
                    <p><span>Created At:</span> {user.createdAt}</p>

                </div>
            </div>
        </div>
    );
}


export default UserProfile;