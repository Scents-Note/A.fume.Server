const redis = require("redis");
require("dotenv").config();

// Creates a new Redis client
// If REDIS_HOST is not set, the default host is localhost
// If REDIS_PORT is not set, the default port is 6379
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT  
});

redisClient.connect().then( async () => {
  console.log('redis connected');

  // Sets the key "octocat" to a value of "Mona the octocat"
  await redisClient.set("octocat", "Mona the Octocat");
  // Sets a key to "octocat", field to "species", and "value" to "Cat and Octopus"
  await redisClient.hSet("species", "octocat", "Cat and Octopus");
  // Sets a key to "octocat", field to "species", and "value" to "Dinosaur and Octopus"
  await redisClient.hSet("species", "dinotocat", "Dinosaur and Octopus");
  // Sets a key to "octocat", field to "species", and "value" to "Cat and Robot"
  await redisClient.hSet("species", "robotocat", "Cat and Robot");

  redisClient.quit();
})
.catch((error) => {
  console.log("Error " + error);
});
