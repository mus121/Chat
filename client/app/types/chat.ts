// types/chat.ts
export interface Message {
    id: string;
    content: string;
    senderId: string;
    display_name: string;
}

export interface SendMessageData {
    chatId: string;
    content: string;
    senderId: string;
    displayName: string;
}

