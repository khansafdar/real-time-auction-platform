const express = require("express");
const Redis = require("ioredis");
const Redlock = require("redlock");

const app = express();
app.use(express.json());

const redis = new Redis({ host: process.env.REDIS_HOST });

const redlock = new Redlock([redis]);

app.post("/place-bid", async (req, res) => {
  const { auctionId, bidderId, amount } = req.body;

  const lock = await redlock.acquire([`lock:${auctionId}`], 1000);

  const current = await redis.hgetall(`auction:${auctionId}`);
  const highest = parseInt(current.amount || "0");

  if (amount <= highest) {
    await lock.release();
    return res.json({ success: false });
  }

  await redis.hmset(`auction:${auctionId}`, {
    amount,
    bidderId
  });

  await redis.publish(
    `auction_channel:${auctionId}`,
    JSON.stringify({ auctionId, amount, bidderId, ts: Date.now() })
  );

  await lock.release();

  res.json({ success: true });
});

app.listen(5001);
