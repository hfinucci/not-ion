import {log} from "util";

let redisconfig = require('redis');

// Creates a client with default port 6379 on localhost
let redisClient = redisconfig.createClient();

async function startClient(){
    await redisClient.connect()
}
startClient().then(r => console.log("connected to redis client"))

export default redisClient