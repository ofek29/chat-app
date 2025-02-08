import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getOrCreateRedisClient, closeRedisClient } from './config/redisClient.js';
import userRoutes from './Routes/userRoutes.js';
import chatRoutes from './Routes/chatRoutes.js';
import messageRoutes from './Routes/messageRoutes.js';

dotenv.config();

const app = express();
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
    connectToDatabase();
    getOrCreateRedisClient();
});


// Connect to MongoDB
let mongoServer;
const connectToDatabase = async () => {
    let mongoUri;
    if (process.env.NODE_ENV === 'test') {
        console.log('local mongodb');
        const { MongoMemoryServer } = await import("mongodb-memory-server");
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
    console.log("\nShutting down...");
    try {
        await closeDatabase(); // Close Mongoose connection
        closeRedisClient(); // Close redis connection

        server.close(() => {
            console.log("Server stopped.");
            process.exit(0);
        });
    } catch (error) {
        console.error('Failed to close server', error);
        process.exit(1);
    }
};

process.on('SIGINT', shutdownServer);
process.on('SIGTERM', shutdownServer);