import { createClient, RedisClientType } from 'redis';
import logger from '@/utils/logger';
import { REDIS_URL } from './env';

export let redisClient: RedisClientType;

const connectRedis = async (): Promise<RedisClientType> => {
    try {
        redisClient = createClient({
            url: REDIS_URL
        });

        redisClient.on('connect', () => console.log('Connected to Redis'));
        redisClient.on('error', (err) => {
            logger.error({
                message: 'Redis connection error',
                details: err.message,
                port: err.port
            });
        });

        await redisClient.connect();
        await redisClient.ping();
        return redisClient;
    } catch (error) {
        logger.error('Failed to connect to Redis:', error);
        process.exit(1);
    }
};

export default connectRedis;
