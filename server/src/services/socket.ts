import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import cors from 'cors';

const initSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    const users: { [key: string]: string } = {};

    io.on('connection', (socket: Socket) => {
        console.log('A user connected:', socket.id);

        // Handle User Registration
        socket.on('register', (email: string) => {
            users[email] = socket.id;
            console.log(`User Register to this email ${email} and SocketId is ${socket.id}`);
            socket.emit('message', 'Welcome to the chat!');
        });
        // Handle disconnect
        socket.on('disconnect', () => {
            // Remove The Users From the users object disconnect
            for (const email in users) {
                if (users[email] == socket.id) {
                    delete users[email];
                    console.log(`User disconnected: ${email}`);
                    break;
                }
            }
        });

        // Listen for direct messages
        socket.on('direct-message', (data: { recipientEmail: string; message: string }) => {
            console.log('Recieved Direct Message: ', data);
            const recipientSocketId = users[data.recipientEmail];
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('message', {
                    from: socket.id,
                    message: data.message
                });
            } else {
                console.log(`User ${data.recipientEmail}is not connected`);
            }
        });
    });

    return io;
};

export default initSocket;
