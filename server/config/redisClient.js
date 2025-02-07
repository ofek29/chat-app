import { GlideClient } from "@valkey/valkey-glide";

let client = null;

export async function createSimpleValkeyGlideClient() {
    const addresses = [{
        host: "localhost",
        port: 6379
    }];

    try {
        client = await GlideClient.createClient({
            addresses,
            clientName: "redisClient",
            connectionBackoff: {
                numberOfRetries: 3,
                factor: 200,
                exponentBase: 2,
            }
        });
        // const pong = await client.customCommand(["PING"], { route: "randomNode" });
        // console.log(`${pong}: Redis Client Connected`);
        return client;
    } catch (error) {
        console.error('Error connecting to Redis:', error);
        return null;
    }
}

createSimpleValkeyGlideClient();

export async function closeRedisClient() {
    if (client) {
        try {
            await client.close();
            console.log('Redis connection closed');
        } catch (error) {
            console.error('Error closing Redis:', error);
        }
    }
}

export default client;