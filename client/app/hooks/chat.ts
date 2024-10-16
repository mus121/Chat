import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";

export const useFetchEmails = () => {
    return useQuery('emails', async () => {
        const { data } = await axios.get('http://localhost:5001/api/private/email', {
            withCredentials: true,

        });
        return data;
    });
};

export const useFetchMessages = (email: string) => {
    return useQuery(
        ['messages', email],
        async () => {
            const { data } = await axios.get(`http://localhost:5001/api/private/messages/${email}`, {
                withCredentials: true,
            });
            return data.map((msg: any) => ({
                from: msg.sender_email,
                message: msg.message_content,
            }));
        },
        {
            enabled: !!email,
        }
    );
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async ({ recipientEmail, content, senderEmail }: { recipientEmail: string; content: string; senderEmail: string }) => {
            await axios.post(
                'http://localhost:5001/api/private/send-message',
                { recipientEmail, content, senderEmail },
                { withCredentials: true }
            );
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('messages');
            },
        }
    )
}