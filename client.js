const redis = require("redis");
require("dotenv").config();

// Creates a new Redis client
// If REDIS_HOST is not set, the default host is localhost
// If REDIS_PORT is not set, the default port is 6379
const redisClient = redis.createClient({
  url: 'redis://redis:6379'
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

  await redisClient.hKeys("species", (err, replies) => {
    if (err) throw err;
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
      console.log("    " + i + ": " + reply);
    });
  });
  
  await redisClient.quit();

})
.catch((error) => {
  console.log("Error " + error);
});
