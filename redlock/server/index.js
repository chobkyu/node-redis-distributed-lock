import Redis from "ioredis";
import Redlock from "redlock";

/**redis 클러스터 노드 연결 */
const redisClients = [
  new Redis({ host: "redis-node-1", port: 6379 }),
  new Redis({ host: "redis-node-2", port: 6379 }),
  new Redis({ host: "redis-node-3", port: 6379 }),
];

//Redlock 인스턴스 생성
const redlock = new Redlock(redisClients, {
  driftFactor: 0.01, //클럭 드리프트 고려 비율
  retryCount: 3, //재시도 횟수
  retryDelay: 200, //재시도 간격(ms)
  retryJitter: 200, // 랜덤 지연시간 추가
});

async function processWithRedlock() {
  const lockKey = "my_distributed_lock";
  const ttl = 5000;

  try {
    const lock = await redlock.lock(lockKey, ttl);
    console.log("redlock 획득! 작업 수행 중...");

    // 작업 수행(3초 대기)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    //release lock
    await lock.unlock();
    console.log("redlock 해제 완료");
  } catch (err) {
    console.log(err);
    console.log("다른 프로세스 작업 중...");
  }
}

processWithRedlock();
