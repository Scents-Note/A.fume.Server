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
  const a = await redisClient.set("octocat", "Mona the Octocat");
  console.log('a', a)
  
  // Sets a key to "octocat", field to "species", and "value" to "Cat and Octopus"
  const b = await redisClient.hSet("species", "octocat", "Cat and Octopus");
  console.log('b', b)
  
  // Sets a key to "octocat", field to "species", and "value" to "Dinosaur and Octopus"
  const c = await redisClient.hSet("species", "dinotocat", "Dinosaur and Octopus");
  console.log('c', c)
  
  // Sets a key to "octocat", field to "species", and "value" to "Cat and Robot"
  const d = await redisClient.hSet("species", "robotocat", "Cat and Robot");
  console.log('d', d)
  
  const e = await redisClient.hKeys("species", (err, replies) => {
    if (err) throw err;
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
      console.log("    " + i + ": " + reply);
    });
  });
  console.log('e', e)
  
  const f = await redisClient.keys('*')
  console.log('f', f)
  
  await redisClient.quit();

})
.catch((error) => {
  console.log("Error " + error);
});
