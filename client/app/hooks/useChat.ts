// app/hooks/useChat.ts
import { useEffect, useState } from 'react';
import { Message } from '../type';

const useChat = (chatId: string, isGroupChat: boolean) => {
    const [messages, setMessages] = useState<Message[]>([]); // Ensure the type matches

    useEffect(() => {
        // Fetch existing messages
        const fetchMessages = async () => {
            const response = await fetch(`http://localhost:5001/chat/messages/${chatId}`);
            const data: Message[] = await response.json(); // Ensure type matches
            setMessages(data); 
        };

        fetchMessages();
    }, [chatId]);

    return { messages, setMessages };
};

export default useChat;
