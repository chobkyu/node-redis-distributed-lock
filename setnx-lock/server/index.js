import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

async function acquireLock(key, ttl) {
  const lock = await redis.set(key, "LOCKED", "NX", "PX", ttl);
  return lock === "OK"; //락을 획득했는지 여부 판단
}

async function releaseLock(key) {
  await redis.del(key);
}

async function processWithLock() {
  const lockKey = "my_resource_lock";
  const lockTTL = 5000; // 5초 동안 락 유지

  const lockAcquired = await acquireLock(lockKey, lockTTL);

  if (!lockAcquired) {
    console.log("다른 프로세스가 사용 중. 다시 시도히시요");
    return;
  }

  try {
    console.log("락 획득! 작업 중");
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 3초 동안 작업
  } finally {
    await releaseLock(lockKey);
    console.log("락 해제 완료");
  }
}

processWithLock();
