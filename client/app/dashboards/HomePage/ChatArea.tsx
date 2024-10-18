'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Message } from '../../types/chat';
import styles from '../scss/home.module.scss';
import { email } from '../../actions';
import {useFetchEmails} from '../../hooks/email';

interface ChatAreaProps {
    selectedEmail: string;
}

const socket = io('http://localhost:5001', {
    withCredentials: true,
});

const ChatArea: React.FC<ChatAreaProps> = () => {
    const [selectedEmail, setSelectedEmail] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [unreadMessages, setUnreadMessages] = useState<{ [key: string]: number }>({});

    const { data: emails = [], isLoading, isError } = useFetchEmails();

    const fetchMessages = async (email: string) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/private/messages/${email}`, {
                withCredentials: true,
            });
            const transformedMessages: Message[] = response.data.map((msg: any) => ({
                from: msg.sender_email,
                message: msg.message_content,
            }));
            setMessages(transformedMessages);
            console.log("Message Response", transformedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        if (selectedEmail) {
            fetchMessages(selectedEmail);
        }
    }, [selectedEmail]);

    useEffect(() => {
        socket.on('message', (msg) => {
            if (msg.sender_email === selectedEmail) {
                setMessages((prevMessages) => [...prevMessages, msg]);
            } else {
                setUnreadMessages((prev) => ({
                    ...prev,
                    [msg.sender_email]: (prev[msg.sender_email] || 0) + 1,
                }));
            }
        });

        return () => {
            socket.off('message');
        };
    }, [selectedEmail]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newMessage.trim() && selectedEmail) {
            const senderEmailCookie = await email();
            const senderEmail = senderEmailCookie?.value || '';
            const messageData = { content: newMessage, recipientEmail: selectedEmail, senderEmail };

            socket.emit('direct-message', messageData);
            setMessages((prevMessages) => [...prevMessages, { from: senderEmail, message: newMessage }]);
            setNewMessage('');
        }
    };

    return (
        <div className={styles.chatArea}>
            <div className={styles.chatBox}>
                {messages.map((msg, index) => (
                    <div className={styles.message} key={index}>
                        <strong>{msg.from}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className={styles.inputText}
                    placeholder="Type your message..."
                />
                <button type="submit" className={styles.sendButton}>Send</button>
            </form>
        </div>
    );
};

export default ChatArea;
