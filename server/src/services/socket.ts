import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import MessageModel from '../models/message'; 

const initSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    const users: { [key: string]: string } = {};
    const groups: { [key: string]: string[] } = {}; 

    io.on('connection', (socket: Socket) => {
        console.log('A user connected:', socket.id);

        const encodedEmail = socket.handshake.headers.cookie?.split('; ')
            .find((row) => row.startsWith('email='))
            ?.split('=')[1];

        const email = encodedEmail ? decodeURIComponent(encodedEmail) : null;

        if (email) {
            users[email] = socket.id;
            console.log(`User registered with email: ${email} and SocketId: ${socket.id}`);
            socket.emit('message', 'Welcome to the chat!');
        } else {
            console.log('Email not found in cookies');
        }

        socket.on('disconnect', () => {
            for (const email in users) {
                if (users[email] === socket.id) {
                    delete users[email];
                    console.log(`User disconnected: ${email}`);
                    break;
                }
            }
        });

        // Listen for direct messages
        socket.on('direct-message', async (data: { recipientEmail: string; content: string }) => {
            console.log('Received Direct Message: ', data);

            const recipientEmail = decodeURIComponent(data.recipientEmail);
            const recipientSocketId = users[recipientEmail];
            const senderEmail = Object.keys(users).find(email => users[email] === socket.id);

            if (recipientSocketId && senderEmail) {
                console.log(`Message from ${senderEmail} to ${recipientEmail}`);

                // Save the message to the database
                try {
                    await MessageModel.addMessage(senderEmail, recipientEmail, data.content);
                    console.log('Message saved to the database');
                    io.to(recipientSocketId).emit('message', {
                        from: senderEmail,
                        message: data.content
                    });
                    socket.emit('message-sent', {
                        to: recipientEmail,
                        message: data.content
                    });
                } catch (error) {
                    console.error('Error saving message to the database:', error);
                    socket.emit('error', 'Failed to send message');
                }
            } else {
                console.log(`Either recipient ${recipientEmail} is not connected or sender ${senderEmail} not found.`);
                socket.emit('error', 'Recipient not found');
            }
        });

        // Group Messages
        socket.on('create-group', (groupId: string, participants: string[]) => {
            groups[groupId] = participants;
            participants.forEach(participant => {
                const participantSocketId = users[participant];
                if (participantSocketId) {
                    socket.join(groupId);
                    console.log(`User ${participant} added to group ${groupId}`);
                }
            });
            console.log(`Group ${groupId} created with participants: ${participants.join(', ')}`);

            // Notify the group that it has been created
            io.to(groupId).emit('group-created', { groupId, participants });
        });


        // Listen for group messages
        socket.on('group-message', async (data: { groupId: string; content: string }) => {
            const senderEmail = Object.keys(users).find(email => users[email] === socket.id);

            if (senderEmail) {
                // Save the message to the database
                try {
                    await MessageModel.addGroupMessage(senderEmail, data.groupId, data.content);
                    console.log('Group message saved to the database');

                    // Emit the message to the group
                    io.to(data.groupId).emit('group-message', {
                        from: senderEmail,
                        message: data.content
                    });
                } catch (error) {
                    console.error('Error saving group message to the database:', error);
                    socket.emit('error', 'Failed to send group message');
                }
            } else {
                console.log(`Sender ${senderEmail} not found.`);
                socket.emit('error', 'Sender not found');
            }
        });
    });

    return io;
};

export default initSocket;
