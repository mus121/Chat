// types/chat.ts
export interface Message {
    id: string;
    content: string;
    senderId: string;
    displayName: string;
    createdAt: string;
}

export interface SendMessageData {
    chatId: string;
    content: string;
    senderId: string;
    displayName: string;
}

export interface Chat {
    id: string;
    name: string;
    isGroupChat: boolean;
}
