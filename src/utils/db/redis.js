import { createClient } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

let redisClient;

try {
    let host;
    let db;

    if (process.env.NODE_LOCATION === process.env.LOCATION_AWS) {
        host = process.env.REDIS_HOST_PROD
    }
    else {
        host = 'localhost'
    }

    if (process.env.NODE_ENV === 'production') {
        db =  process.env.REDIS_DB_ID_PROD
    } else if (process.env.NODE_ENV === 'test') {
        db = process.env.REDIS_DB_ID_TEST
    } else {
        db = process.env.REDIS_DB_ID_DEV
    }

    const config = {
        host,
        port: process.env.REDIS_PORT,
        db
    }
    redisClient = createClient(config);

    console.log(`Successfully connected to ${process.env.NODE_LOCATION} Redis`)
}
catch (err) {
    console.error(err)
}

module.exports = redisClient;