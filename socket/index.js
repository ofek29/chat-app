const { Server } = require("socket.io");

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
        console.log(onlineUsers);

        const user = onlineUsers.find(user => user.userId === message.recipientId);
        if (user) {
            console.log(user, message);

            io.to(user.socketId).emit('receiveMessage', message);
        }
    });

    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        io.emit('getOnlineUsers', onlineUsers);
        console.log('user disconnected', onlineUsers);

    })
});

io.listen(3020);

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