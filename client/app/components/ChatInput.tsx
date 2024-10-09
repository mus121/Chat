
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

interface ChatInputProps {
    chatId: string; 
    isGroupChat: boolean; 
}

const ChatInput: React.FC<ChatInputProps> = ({ chatId, isGroupChat }) => {
    const { user } = useAuth(); // Access the user from useAuth
    const [messageContent, setMessageContent] = useState<string>(''); // Specify state type

    const sendMessage = async () => {
        if (!messageContent || !user) return; 

        const response = await fetch(`http://localhost:5001/chat/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: messageContent,
                chatId: chatId,
                senderId: user.id, //
                recipientId: isGroupChat ? null : 'recipientId_here', 
                displayName: user.displayName, 
            }),
        });

        if (response.ok) {
            setMessageContent('');
        } else {
            console.error('Error sending message');
        }
    };

    return (
        <div>
            <input 
                type="text" 
                value={messageContent} 
                onChange={(e) => setMessageContent(e.target.value)} 
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatInput;
