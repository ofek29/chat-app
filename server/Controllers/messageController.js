import messageModel from '../Models/messageModel.js';
import { getOrCreateRedisClient } from '../config/redisClient.js';
const CACHE_TIME = 60 * 10; // 10 MIN

const redisClient = await getOrCreateRedisClient();

// Create and save a new message to the database and Redis
export const createMessage = async (req, res) => {
    const { chatId, senderId, content } = req.body;
    try {
        const message = new messageModel({
            chatId,
            senderId,
            content
        });
        const response = await message.save();

        try {
            if (redisClient) {
                await pushMessageToRedis(chatId, message);
            }
        } catch (redisError) {
            console.error('Redis set error:', redisError.message);
        }

        res.status(200).json(response);
    } catch (error) {
        console.log('Error creating message')
        res.status(500).json(error)
    }
};

// Retrieve and return all messages from the database or Redis if available
export const getMessages = async (req, res) => {
    const { chatId } = req.params;
    const { getLastMessage = false } = req.query;

    try {
        if (redisClient && !getLastMessage) {
            const cachedMessages = await getMessagesFromRedis(chatId);
            if (cachedMessages && cachedMessages.length > 0) {
                console.log('Messages fetched from redis');
                return res.status(200).json(cachedMessages);
            }
        }
    } catch (redisError) {
        console.error('Redis get error:', redisError.message);
    }

    try {
        let messages;
        if (getLastMessage) {
            messages = await messageModel
                .find({ chatId })
                .sort({ createdAt: -1 })
                .limit(1);
        } else {
            console.log('Fetching messages from MongoDB');
            messages = await messageModel
                .find({ chatId })
                .sort({ createdAt: 1 });
        }

        try {
            if (redisClient && !getLastMessage) {
                await saveMessagesToRedis(chatId, messages);
            }
        } catch (redisError) {
            console.error('Redis set error:', redisError.message);
        }

        return res.status(200).json(messages);

    } catch (dbError) {
        console.error('DB error', dbError);
        return res.status(500).json(dbError);
    }
};


// Save messages that fetched from database to Redis
async function saveMessagesToRedis(chatId, messages) {
    try {
        if (messages.length > 0) {
            const messagesAsStrings = messages.map((message) => JSON.stringify(message));
            await redisClient.rpush(chatId, messagesAsStrings);
            await redisClient.expire(chatId, CACHE_TIME);

            console.log(`Saved ${messages.length} messages to Redis for chatId: ${chatId}`);
        }
    } catch (error) {
        console.error('Error saving messages to Redis list:', error.message);
    }
};

// Fetch messages from Redis
async function getMessagesFromRedis(chatId) {
    try {
        const messages = await redisClient.lrange(chatId, 0, -1);
        return messages.map((msg) => JSON.parse(msg));
    } catch (error) {
        console.error('Error fetching messages from Redis list:', error.message);
    }
};

// Push received message to Redis
async function pushMessageToRedis(chatId, message) {
    try {
        if (!message) return;
        await redisClient.rpush(chatId, JSON.stringify(message));
        console.log('Message pushed to Redis list for chatId:', chatId);
    } catch (error) {
        console.error('Error pushing message to Redis list:', error.message);
    }
};

