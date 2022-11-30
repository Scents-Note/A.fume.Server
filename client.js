const redis = require("redis");

// Creates a new Redis client
// If REDIS_HOST is not set, the default host is localhost
// If REDIS_PORT is not set, the default port is 6379
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT  
});

await redisClient.connect()

redisClient.on("error", function(err) {
    console.log("Error " + err);
});

// Sets the key "octocat" to a value of "Mona the octocat"
redisClient.set("octocat", "Mona the Octocat");
// Sets a key to "octocat", field to "species", and "value" to "Cat and Octopus"
redisClient.hSet("species", "octocat", "Cat and Octopus");
// Sets a key to "octocat", field to "species", and "value" to "Dinosaur and Octopus"
redisClient.hSet("species", "dinotocat", "Dinosaur and Octopus");
// Sets a key to "octocat", field to "species", and "value" to "Cat and Robot"
redisClient.hSet("species", "robotocat", "Cat and Robot");
// Gets all fields in "species" key

redisClient.hKeys("species", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    redisClient.quit();
});
