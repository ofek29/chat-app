const { createClient } = require("redis");

// Create a Redis client
const redisClient = createClient({ // timeout
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        reconnectStrategy: (retries) => {
            console.error(`Redis connection failed. Retry attempt: ${retries}`);
            if (retries >= 5) {
                console.error('Maximum retry attempts reached. Stopping Redis retries.');
                return new Error('Redis connection failed after maximum retries');
            }
            return Math.min(retries * 100, 3000); // Retry with exponential backoff
        },
    },
});

redisClient.on('connect', () => {
    console.log('Redis Client Connected');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

// Connect to Redis
(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
})();

module.exports = redisClient;
