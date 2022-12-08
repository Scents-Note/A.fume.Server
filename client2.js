const redis = require("redis");

// Creates a new Redis client
const redisClient = redis.createClient({
    // format: redis://[host][:port]
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    legacyMode: true
});

redisClient.on("error", function (err) {
    console.log("Error " + err);
});

redisClient.connect()

// Sets the key "octocat" to a value of "Mona the octocat"
redisClient.set("octocat", "Mona the Octocat", function (err, reply) { console.log("Reply: ", reply) });
// Sets a key to "species", field to "octocat", and "value" to "Cat and Octopus"
redisClient.hset("species", "octocat", "Cat and Octopus", function (err, reply) { console.log("Reply: ", reply) });
// Sets a key to "species", field to "dinotocat", and "value" to "Dinosaur and Octopus"
redisClient.hset("species", "dinotocat", "Dinosaur and Octopus", function (err, reply) { console.log("Reply: ", reply) });
// Sets a key to "species", field to "robotocat", and "value" to "Cat and Robot"
redisClient.hset(["species", "robotocat", "Cat and Robot"], function (err, reply) { console.log("Reply: ", reply) });

// Gets all fields in "species" key
redisClient.hkeys("species", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    redisClient.disconnect()
})