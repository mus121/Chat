'use client';

import React, { useEffect, useState } from 'react';
import Navbar from './Nabar';
import SideNavbar from './SideNavbar';
import styles from './scss/home.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useFetchEmails } from '../hooks/email';
import { io } from 'socket.io-client';
import { email } from '../actions';
import axios from 'axios';
import Image from 'next/image';

const socket = io('http://localhost:5001', { withCredentials: true });

interface Message {
    from: string;
    message: string;
}

const Home: React.FC = () => {
    const [selectedEmail, setSelectedEmail] = useState<string>('');
    const [isDirectMessagesOpen, setIsDirectMessagesOpen] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [unreadMessages, setUnreadMessages] = useState<{ [key: string]: number }>({});

    const { data: emails = [], isLoading, isError } = useFetchEmails();

    const fetchMessages = async (email: string) => {
        try {
            console.log('Fetching messages for:', email); // Debug log
            const response = await axios.get(`http://localhost:5001/api/private/messages/${email}`, { withCredentials: true });
            const transformedMessages: Message[] = response.data.map((msg: any) => ({
                from: msg.sender_email,
                message: msg.message_content,
            }));
            console.log('Fetched Messages:', transformedMessages); 
            setMessages(transformedMessages);
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
        // Listen for incoming messages
        socket.on('message', (msg) => {
            console.log('Received Message:', msg);
            if (msg.from === selectedEmail) {
                setMessages((prevMessages) => [...prevMessages, { from: msg.from, message: msg.message }]);
            } else {
                setUnreadMessages((prev) => ({
                    ...prev,
                    [msg.from]: (prev[msg.from] || 0) + 1,
                }));
            }
        });

        return () => {
            socket.off('message');
        };
    }, [selectedEmail]);

    const toggleDirectMessages = () => {
        setIsDirectMessagesOpen((prev) => !prev);
    };

    const handleSelectDirectMessage = (email: string) => {
        setSelectedEmail(email);
        setUnreadMessages((prev) => ({ ...prev, [email]: 0 }));
        fetchMessages(email);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

      
        const senderEmailCookie = document.cookie.split('; ').find(row => row.startsWith('email='));
        const senderEmail = senderEmailCookie ? decodeURIComponent(senderEmailCookie.split('=')[1]) : '';

        
        console.log('Sender Email:', senderEmail);
        console.log('New Message:', newMessage);

        if (!senderEmail || !newMessage) {
            console.error('Cannot send message. Sender Email or New Message is undefined.');
            return; 
        }

        const messageData = { content: newMessage, recipientEmail: selectedEmail };

       
        socket.emit('direct-message', messageData);

        console.log('Current Messages:', messages);

        // Update messages state
        setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, { from: senderEmail, message: newMessage }];
            console.log('Updated Messages:', updatedMessages);
            return updatedMessages;
        });

        setNewMessage('');
    };

    // Filter emails based on search query
    const filteredEmails = emails.filter((email: string) => email.toLowerCase().includes(searchQuery.toLowerCase()));

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
                                    <div className={styles.chatBox} key={JSON.stringify(messages)}>
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
