import React, { useState } from 'react';
import { sendMessage, readRandomMessage } from '../apiService';
// Import DTOs from TypeScript file
import { MessageDTO } from '../shared/dto/dtos';

function Messages() {
    const [messageContent, setMessageContent] = useState('');
    const [randomMessage, setRandomMessage] = useState(null);

    const handleSendMessage = async () => {
        try {
            const response = await sendMessage({ content: messageContent });

            /** @type {MessageDTO} */
            const sentMessage = response.data;
            console.log('Message sent:', sentMessage);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleReadMessage = async () => {
        try {
            const response = await readRandomMessage();

            /** @type {MessageDTO} */
            const message = response.data;
            setRandomMessage(message);
        } catch (error) {
            console.error('Error reading message:', error);
        }
    };

    return (
        <div>
            <h2>Messages</h2>
            <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Write a message..."
            />
            <button onClick={handleSendMessage}>Send Message</button>

            <h3>Random Message:</h3>
            {randomMessage ? (
                <div>
                    <p>{randomMessage.content}</p>
                    <p>Sent by: {randomMessage.profile.username}</p>
                </div>
            ) : (
                <p>No message loaded.</p>
            )}
            <button onClick={handleReadMessage}>Read Random Message</button>
        </div>
    );
}

export default Messages;