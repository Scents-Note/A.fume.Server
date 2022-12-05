const redis = require("redis");
require("dotenv").config();

// Creates a new Redis client
const redisClient = redis.createClient({
  // format: redis://[host][:port][/db-number]
  url: 'redis://redis:6379[15]'
});

redisClient.on("error", (err) => console.log("Error", err));

async () => {
  await redisClient.connect()
  console.log('redis connected');

  // Sets the key "octocat" to a value of "Mona the octocat"
  await redisClient.set("octocat", "Mona the Octocat");
  
  // Sets a key to "species", field to "octocat", and "value" to "Cat and Octopus"
  await redisClient.hSet("species", "octocat", "Cat and Octopus");
  
  // Sets a key to "species", field to "dinotocat", and "value" to "Dinosaur and Octopus"
  await redisClient.hSet("species", "dinotocat", "Dinosaur and Octopus");
  
  // Sets a key to "species", field to "robotocat", and "value" to "Cat and Robot"
  await redisClient.hSet("species", "robotocat", "Cat and Robot");
  
  try {
    // Gets all fields in "species" key
    const replies = await redisClient.hKeys("species")
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
  }
  catch (err) {
    // Write down how to handle errors
  }
  
  await redisClient.quit();
}
