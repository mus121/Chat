'use client';

import React, { useEffect, useState } from 'react';
import Navbar from './Nabar';
import SideNavbar from './SideNavbar';
import styles from './scss/home.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {useFetchEmails} from '../hooks/email';
import { io } from 'socket.io-client';
import { email } from '../actions';
import axios from 'axios';
import Image from 'next/image';
import { Message } from '../types/chat';

const socket = io('http://localhost:5001', {
    withCredentials: true,
});

const Home: React.FC = () => {
    const [selectedEmail, setSelectedEmail] = useState<string>('');
    const [isDirectMessagesOpen, setIsDirectMessagesOpen] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [unreadMessages, setUnreadMessages] = useState<{ [key: string]: number }>({});

    const { data: emails = [], isLoading, isError } = useFetchEmails();

    // Function to fetch messages based on selected email
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

    // Toggle Direct Messages section
    const toggleDirectMessages = () => {
        setIsDirectMessagesOpen((prev) => !prev);
    };

    // Function to handle selecting an email for direct messages
    const handleSelectDirectMessage = async (email: string) => {
        setSelectedEmail(email);
       
        setUnreadMessages((prev) => ({
            ...prev,
            [email]: 0, 
        }));
    };

    // Handle sending direct message
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

    // Filter emails based on search query
    const filteredEmails = emails.filter((email: string) =>
        email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <SideNavbar />
            <div className="container">
                <div className={styles.mainContainer}>
                    <div className="row">
                        {/* Sidebar */}
                        <div className={styles.chatMap}>
                            <div className={styles.qluAi}>
                                <div className={styles.sidebar}>
                                    <h2 className={styles.qluRequire}>QLU Recruiting</h2>
                                    <div className={styles.parentSide}>
                                        {/* Groups Section */}
                                        <div className={styles.groups}>
                                            <h3 className={styles.dropdownHeader}>
                                                <FontAwesomeIcon icon={faUsers} className={styles.icon} />
                                                <span className={styles.groupText}>Groups</span>
                                            </h3>
                                        </div>
                                        {/* Direct Messages Section */}
                                        <div className={styles.directMessages}>
                                            <h3 onClick={toggleDirectMessages} className={styles.dropdownHeader}>
                                                <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                                                <span className={styles.directText}>Direct Messages</span>
                                            </h3>
                                        </div>
                                        {/* Direct Messages UI */}
                                        {isDirectMessagesOpen && (
                                            <div>
                                                <ul className={styles.dropdownList}>
                                                    {filteredEmails.map((email: string, index: number) => (
                                                        <li
                                                            key={index}
                                                            onClick={() => handleSelectDirectMessage(email)}
                                                            className={styles.emails}
                                                        >
                                                            {email}
                                                            {unreadMessages[email] > 0 && (
                                                                <span className={styles.unreadCount}>
                                                                    {unreadMessages[email]}
                                                                </span>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Chat Area */}
                        <div className="">
                            <div className={`${styles.chat11} container-fluid`}>
                                <div className="message-input">
                                    {selectedEmail && <p className={styles.selectedEmail}>Chat with: {selectedEmail}</p>}
                                    <div className={styles.chatBox}>
                                        {messages.length > 0 ? (
                                            messages.map((msg, index) => (
                                                <div className={`${styles.ChatMessages} d-flex`} key={index}>
                                                    <div className={styles.image}>
                                                        <Image
                                                            src="/images/chat.jpeg"
                                                            alt="Chat Image"
                                                            width={20}
                                                            height={20}
                                                            objectFit="cover"
                                                            className={styles.customImage}
                                                        />
                                                    </div>
                                                    <div className={styles.message}>
                                                        <div><strong className={styles.fromEmail}>{msg.from}</strong></div>
                                                        <div className={styles.fromMessage}>{msg.message}</div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className={styles.emptyMessage}>No messages yet.</p>
                                        )}
                                    </div>

                                    <form onSubmit={handleSendMessage} className='d-flex'>
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message"
                                            className={`${styles.inputText} form-control`}
                                            required
                                        />
                                        <div className={styles.buttonLeft}>
                                            <button className={`${styles.sendButton} btn`} type="submit">Send</button>
                                        </div>
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