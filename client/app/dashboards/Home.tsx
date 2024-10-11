'use client';

import React, { useEffect, useState } from 'react';
import Navbar from './Nabar';
import SideNavbar from './SideNavbar';
import styles from './scss/home.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import useFetchEmails from '../hooks/email';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

const socket = io('http://localhost:3000');  // Ensure the correct Socket.IO server URL

const Home: React.FC = () => {
    const [selectedEmail, setSelectedEmail] = useState<string>('');
    const [isDirectMessagesOpen, setIsDirectMessagesOpen] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<string>('');
    const [messages, setMessages] = useState<{ from: string; message: string }[]>([]);

    // Fetch emails using the custom hook
    const { data: emails = [], isLoading, isError } = useFetchEmails();

    // Register the user upon connection
    useEffect(() => {
        socket.on('connect', () => {
            const userEmail = Cookies.get('email');
            if (userEmail) {
                socket.emit('register', userEmail);
            }
        });

        // Listen for incoming messages
        socket.on('message', (msg: { from: string; message: string }) => {
            setMessages((prevMessages) => [...prevMessages, msg]);  // Add incoming messages to state
        });

        return () => {
            socket.off('connect');
            socket.off('message');
        };
    }, []);

    const toggleDirectMessages = () => {
        setIsDirectMessagesOpen((prev) => !prev);
    };

    const handleSelectDirectMessage = (email: string) => {
        setSelectedEmail(email);
    };

    const handleSendMessage = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const senderEmail = Cookies.get('email');
        
        // Check if newMessage is not empty and both emails exist
        if (newMessage.trim() && selectedEmail && senderEmail) {
            const messageData = {
                content: newMessage,
                recipientEmail: selectedEmail,
                senderEmail,
            }; 
            // Send message via Socket.IO
            socket.emit('direct-message', messageData);           
            // Add the message to local state for display
            setMessages((prevMessages) => [
                ...prevMessages,
                { from: senderEmail, message: newMessage },
            ]);
            setNewMessage('');
        }
    };
    

    return (
        <>
            <Navbar />
            <SideNavbar />
            <div className="container">
                <div className={styles.mainContainer}>
                    <div className="row">
                        <div className="col-xxl-3 col-xl-3 col-md-3 col-sm-3">
                            <div className={styles.qluAi}>
                                <div className={styles.sidebar}>
                                    <h2 className={styles.qluRequire}>QLU Recruiting</h2>
                                    <div className={styles.parentSide}>
                                        <div className={styles.groups}>
                                            <h3 className={styles.dropdownHeader}>
                                                <FontAwesomeIcon icon={faUsers} className={styles.icon} />
                                                <span className={styles.groupText}>Groups</span>
                                            </h3>
                                        </div>
                                        <div className={styles.directMessages}>
                                            <h3 onClick={toggleDirectMessages} className={styles.dropdownHeader}>
                                                <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                                                <span className={styles.directText}>Direct Messages</span>
                                            </h3>
                                        </div>
                                        {isLoading && <p>Loading emails...</p>}
                                        {isError && <p>Error loading emails!</p>}
                                        {isDirectMessagesOpen && (
                                            <ul className={styles.dropdownList}>
                                                {emails.map((email: string, index: number) => (
                                                    <li
                                                        key={index}
                                                        onClick={() => handleSelectDirectMessage(email)}
                                                        className={styles.emails}
                                                    >
                                                        {email}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-9 col-xl-9 col-md-9 col-sm-9">
                            <div className="container-fluid chat-area" style={{ position: 'absolute', bottom: 0 }}>
                                <div className="message-input">
                                    {selectedEmail && <p className={styles.selectedEmail}>Chat with: {selectedEmail}</p>}
                                    <div className={styles.chatBox}>
                                        {messages.map((msg, index) => (
                                            <div key={index}>
                                                <strong>{msg.from}: </strong>
                                                {msg.message}
                                            </div>
                                        ))}
                                    </div>
                                    <form onSubmit={handleSendMessage}>
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            className="form-control"
                                        />
                                        <button className="btn btn-primary" type="submit">
                                            Send
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
