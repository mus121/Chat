import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

// Define types for messages and message data
interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface MessageData {
  chatId: string;
  isGroupChat: boolean;
  senderId: string;
  content: string;
}

// Fetch messages based on chatId and chat type
const fetchMessages = async (chatId: string, isGroupChat: boolean): Promise<Message[]> => {
  const response = await axios.get(`http://localhost:5001/chat/messages/${chatId}`, {
    params: { isGroupChat },
  });
  return response.data;  
};

// Send a new message
const sendMessage = async (messageData: MessageData): Promise<Message> => {
  const response = await axios.post('http://localhost:5001/chat/send', messageData);
  return response.data; 
};

// React Query hook to fetch messages
export const useFetchMessages = (chatId: string, isGroupChat: boolean) => {
  return useQuery<Message[], Error>(['messages', chatId, isGroupChat], () => fetchMessages(chatId, isGroupChat));
};

// React Query hook to send messages
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, MessageData>(sendMessage, {
    onSuccess: (_, variables) => {
      // Invalidate and refetch messages after successfully sending a new message
      queryClient.invalidateQueries(['messages', variables.chatId, variables.isGroupChat]);
    },
  });
};
