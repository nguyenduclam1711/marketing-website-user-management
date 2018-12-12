const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const DOMAIN = process.env.DOMAIN || "localhost"
const PORT = process.env.PORT || 3000
const { promisify } = require('util');

var mongopath = process.env.MONGOURL || "mongodb://localhost:27017/marketing-website"
var url = `${DOMAIN}:${PORT}`

const getAsyncRedis = () => {
  try {
    const redis = require("redis");
    const redisClient = redis.createClient({
      host: "127.0.0.1",
      port: 6379
    });
  
    redisClient.on("error", function (error) {
      console.error("Redis ERROR: " + error);
      process.exit();
    })
  
    redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
    redisClient.setAsync = promisify(redisClient.set).bind(redisClient);
  
    return redisClient;
  }
  catch(err) {
    console.log(`Error occured in helper.js \n${err}`)
  }
}

module.exports = { url, mongopath, getAsyncRedis }
