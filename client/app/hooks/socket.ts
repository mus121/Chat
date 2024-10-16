// hooks/useSocket.ts

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { email as getEmail } from '../actions';

interface Message {
    from: string;
    message: string;
}

const useSocket = () => {
    const [socketMessages, setSocketMessages] = useState<Message[]>([]);
    const socket: Socket = io('http://localhost:5001', {
        withCredentials: true,
    });

    useEffect(() => {
        const initializeSocket = async () => {
            const userEmail = await getEmail();
            if (userEmail) {
                socket.emit('register', userEmail);
            }
        };

        socket.on('connect', initializeSocket);

        // Handle incoming direct message
        socket.on('message', (msg: Message) => {
            setSocketMessages((prevMessages) => [...prevMessages, msg]);
        });

        // Handle incoming group message
        socket.on('group-message', (msg: Message) => {
            setSocketMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('connect');
            socket.off('message');
            socket.off('group-message');
        };
    }, [socket]);

    return { socketMessages, socket };
};

export default useSocket;
