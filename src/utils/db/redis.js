import { createClient } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

let redisClient;

try {
    if (process.env.NODE_LOCATION === process.env.LOCATION_AWS) {
        redisClient = createClient({ host : process.env.REDIS_HOST_PROD, port: process.env.REDIS_PORT})
    }
    else {
        redisClient = createClient({ host : 'localhost', port: process.env.REDIS_PORT}) // 로컬에서 작업시 로컬 레디스 사용
    }
    console.log(`Successfully connected to ${process.env.NODE_LOCATION} Redis`)
}
catch (err) {
    console.error(err)
}

module.exports = redisClient;