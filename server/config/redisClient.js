import { GlideClient } from "@valkey/valkey-glide";

let client = null;

/**
 * Create a Redis client if it doesn't exist.
 * @returns {Promise<GlideClient>}
 */
export async function getOrCreateRedisClient() {
    if (client) return client;
    const addresses = [{
        host: "localhost",
        port: 6379
    }];
    try {
        client = await GlideClient.createClient({
            addresses: addresses,
            clientName: "redisClient",
            requestTimeout: 500,
            connectionBackoff: {
                numberOfRetries: 2,
            },
        });
        console.log('Connected to Redis');
        return client;
    } catch (error) {
        console.error('Error connecting to Redis:', error);
        return null;
    }
}


export function closeRedisClient() {
    if (client) {
        try {
            client.close();
            console.log('Redis connection closed');
        } catch (error) {
            console.error('Error closing Redis:', error);
        }
    }
}