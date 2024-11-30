const { Server } = require("socket.io");
require('dotenv').config();


const io = new Server({ cors: 'http://localhost:5173' });
console.log('New socket server');

const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('new socket connection', socket.id);

    socket.on('addNewUser', (userId) => {
        addUser(userId, socket.id);
        console.log('online users:', onlineUsers);
        io.emit('getOnlineUsers', JSON.stringify(Array.from(onlineUsers)));
    });

    //add message to online users
    socket.on('sendMessage', (message) => {
        recipientSockets = onlineUsers.get(message.recipientId);
        if (recipientSockets) {
            recipientSockets.forEach((socketId) => {
                io.to(socketId).emit('receiveMessage', message);
            });
        }
    });

    //add chat to user opened chats
    socket.on('sendNewUserChat', (chat, recipientId) => {
        let recipientSockets = onlineUsers.get(recipientId);
        if (recipientSockets) {
            recipientSockets.forEach((socketId) => {
                io.to(socketId).emit('getNewUserChat', chat);
            });
        }
    });

    //disconnect user when closing browser
    socket.on('disconnect', () => {
        removeUser(socket.id);
        console.log('user disconnected', onlineUsers);
        io.emit('getOnlineUsers', JSON.stringify(Array.from(onlineUsers)))
    })
});

const port = process.env.PORT || 3020;
io.listen(port);
console.log('socket listening on port', port);

// add user to online users collection
function addUser(userId, socketId) {
    if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).push(socketId);
    } else {
        onlineUsers.set(userId, [socketId]);
    }
}

// remove user from online users collection
function removeUser(socketId) {
    for (const [userId, socketIds] of onlineUsers.entries()) {
        const index = socketIds.indexOf(socketId);
        if (index !== -1) {
            socketIds.splice(index, 1);
            if (socketIds.length === 0) {
                onlineUsers.delete(userId);
                break;
            }
        }
    }
}

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