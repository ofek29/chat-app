import messageModel from '../Models/messageModel.js';
import { getOrCreateRedisClient } from '../config/redisClient.js';
const CACHE_TIME = 60 * 10; // 10 MIN

const redisClient = await getOrCreateRedisClient();

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


export const getMessages = async (req, res) => {
    const { chatId } = req.params;
    const { limit = 0, offset = 0, sortOrder = 1 } = req.query; // Default: no limit, start at 0, sort to get last message

    let cachedMessages = null;
    try {
        if (redisClient) {
            cachedMessages = await getMessagesFromRedis(chatId, limit, offset, Number(sortOrder));
        }
    } catch (redisError) {
        console.error('Redis get error:', redisError.message);
    }
    if (cachedMessages && cachedMessages.length > 0) {
        console.log('Messages fetched from redis', cachedMessages);
        return res.status(200).json(cachedMessages);
    }

    try {
        console.log('Fetching messages from MongoDB');
        const messages = await messageModel
            .find({ chatId })
            .sort({ createdAt: Number(sortOrder) })
            .skip(Number(offset))
            .limit(Number(limit));

        try {
            if (messages.length > 0 && limit == 0 && redisClient) { // for now temp. if want a specific message don't save
                await saveMessagesToRedisAsList(chatId, messages);
            }
        } catch (redisError) {
            console.error('Redis set error:', redisError.message);
        }
        return res.status(200).json(messages);
    } catch (DbError) {
        console.error('DB error', DbError);
        return res.status(500).json(DbError);
    }
};


const saveMessagesToRedisAsList = async (chatId, messages) => {
    try {
        if (messages.length > 0) {
            const messagesAsStrings = messages.map((message) => JSON.stringify(message));
            await redisClient.rpush(chatId, ...messagesAsStrings);
            await redisClient.expire(chatId, CACHE_TIME);
            console.log(`Saved ${messages.length} messages to Redis for chatId: ${chatId}`);
        }
    } catch (error) {
        console.error('Error saving messages to Redis list:', error.message);
    }
};

const getMessagesFromRedis = async (chatId, limit, offset, sortOrder) => {
    try {
        let messages;
        if (sortOrder === -1) {
            messages = await redisClient.lrange(chatId, -1, -1);
        } else {
            // Fetch messages in the specified range (default: all messages)
            messages = await redisClient.lrange(chatId, offset, offset + limit - 1);
        }
        return messages.map((msg) => JSON.parse(msg));
    } catch (error) {
        console.error('Error fetching messages from Redis list:', error.message);
        return null;
    }
};

const pushMessageToRedis = async (chatId, message) => {
    try {
        if (!message) return;
        await redisClient.rpush(chatId, JSON.stringify(message));
        await redisClient.expire(chatId, CACHE_TIME);
        console.log('Message pushed to Redis list for chatId:', chatId);
    } catch (error) {
        console.error('Error pushing message to Redis list:', error.message);
    }
};

