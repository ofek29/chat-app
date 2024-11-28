const { Server } = require("socket.io");
require('dotenv').config();


const io = new Server({ cors: 'http://localhost:5173' });
console.log('New socket server');

let onlineUsers = [];

io.on('connection', (socket) => {
    console.log('new socket connection', socket.id);

    socket.on('addNewUser', (userId) => {
        !onlineUsers.some((user) => user.userId === userId) &&
            onlineUsers.push({
                userId,
                socketId: socket.id
            });
        console.log('online users:', onlineUsers);
        io.emit('getOnlineUsers', onlineUsers);
    });

    //add message to online users
    socket.on('sendMessage', (message) => {
        const user = onlineUsers.find(user => user.userId === message.recipientId);
        if (user) {
            io.to(user.socketId).emit('receiveMessage', message);
            // io.to(user.socketId).emit('getNotification', {
            //     senderId: message.senderId,
            //     isRead: false,
            //     date: new Date()
            // });
        }
    });

    //add chat to user opened chats
    socket.on('sendNewUserChat', (chat, recipientId) => {
        const user = onlineUsers.find(user => user.userId === recipientId);
        if (user) {
            io.to(user.socketId).emit('getNewUserChat', chat);
        }
    });

    //add chat to user closed chats
    socket.on('closeChat', (chatId) => {
        const user = onlineUsers.find(user => user.socketId === socket.id);
        if (user) {
            io.to(user.socketId).emit('closeChat', chatId);
        }
    });

    //disconnect user when closing browser
    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        io.emit('getOnlineUsers', onlineUsers);
        console.log('user disconnected', onlineUsers);
    })
});

const port = process.env.PORT || 3020;
io.listen(port);
console.log('socket listening on port', port);


//Shutdown the socket server
const shutdownSocket = async () => {
    console.log('shutting down socket server');
    try {
        await io.close();
        console.log('socket server closed');

    } catch (error) {
        console.log(error);
    }
    process.exit(0);
}

process.on('SIGINT', shutdownSocket);
process.on('SIGTERM', shutdownSocket);