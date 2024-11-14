const { Server } = require("socket.io");

const io = new Server({ cors: 'http://localhost:5173' });

let onlineUsers = [];

io.on("connection", (socket) => {
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
    })
});

io.listen(3020);