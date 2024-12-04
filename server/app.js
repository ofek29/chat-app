const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const redisClient = require('./config/redisClient');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require('./Routes/messageRoutes');

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});

// Connect to MongoDB
let mongoServer;
const connectToDatabase = async () => {
    let mongoUri;
    if (process.env.NODE_ENV === 'test') {
        console.log('local mongodb');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
    } else {
        mongoUri = process.env.MONGOOSE_URI;
    }
    try {
        await mongoose.connect(mongoUri);
        console.log("mongoose connected");
    } catch (error) {
        console.error("mongoose connection failed:", error)
    }
};

connectToDatabase();

const closeDatabase = async () => {
    try {
        if (process.env.NODE_ENV === 'test') {
            await mongoServer.stop()
        }
        await mongoose.connection.close();
        console.log("Mongoose connection closed.");
    } catch (err) {
        console.error("Error closing Mongoose connection:", err);
    }
};

const shutdownServer = async () => {
    console.log("Shutting down...");
    try {
        await closeDatabase(); // Close Mongoose connection
        try {
            await redisClient.quit(); // Close redis connection
            console.log('Redis connection closed');
        } catch (err) {
            console.error('Error closing Redis connection:', err.message);
        }
        server.close(() => {
            console.log("Server stopped.");
            process.exit(0);
        });
    } catch (error) {
        console.log('Failed to close server', error);
    }
};

process.on('SIGINT', shutdownServer);
process.on('SIGTERM', shutdownServer);