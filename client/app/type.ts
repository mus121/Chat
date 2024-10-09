// app/types.ts
export interface Message {
    displayName: string; // The name of the user who sent the message
    content: string; // The message content
    senderId: string; // The ID of the user who sent the message
    timestamp: string; // The time when the message was sent
}
