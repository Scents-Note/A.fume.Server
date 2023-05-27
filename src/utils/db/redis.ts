import properties from '@properties';
import Redis, { RedisOptions } from 'ioredis';

const config: RedisOptions = {
    host: properties.REDIS_HOST,
    port: Number(properties.REDIS_PORT),
    db: Number(properties.REDIS_DB_ID),
};

const redisClient = new Redis(config);

export default redisClient;
