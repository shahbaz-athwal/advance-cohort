import { Redis } from "@upstash/redis";
import dotenv from 'dotenv';
import crypto from "crypto";

dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function test() {

    const ipSource = '   12.33.44.23'
    const ip = ipSource.split(",")[0].trim();
    const hashedIp = crypto.createHash("sha256").update(ip).digest("hex");
    const ipViewKey = ["ip", ip, "views"].join(":");
    // redis.set(ipViewKey,'1')
    redis.incr(ipViewKey)
}

test()

