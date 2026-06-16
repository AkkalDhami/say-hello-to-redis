import Redis from "ioredis";
import env from "./env";

const redis = new Redis(env.REDIS_URL);

redis.on("error", (err) => console.log("Redis Client Error:", err));

export default redis;
