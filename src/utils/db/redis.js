import { createClient } from 'ioredis';
import { logger } from '@modules/winston';
import properties from '@properties';

let redisClient;

try {
    const config = {
        host: properties.REDIS_HOST,
        port: properties.REDIS_PORT,
        db: properties.REDIS_DB_ID
    }
    redisClient = createClient(config);

    logger.debug(
        `Successfully connected to ${properties.NODE_LOCATION} Redis`
    );
}
catch (err) {
    console.error(err)
}

module.exports = redisClient;