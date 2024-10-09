// app/components/MessageList.tsx
'use client';

import React from 'react';
import { Message } from '../type';

interface MessageListProps {
    messages: Message[]; // Ensure the type matches
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    return (
        <div>
            {messages.map((message, index) => (
                <div key={index}>
                    <strong>{message.displayName}</strong>: {message.content} <em>{message.timestamp}</em>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
