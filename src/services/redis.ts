import * as FS from "fs";
import redis, { RedisClient } from "redis";
import { promisify } from "util";
import * as Path from "path";

export class Redis {
  private static client: RedisClient;

  static getClient(): RedisClient {
    return (
      Redis.client ||
      (Redis.client = redis.createClient({
        host: "127.0.0.1",
        port: 6379
      }))
    );
  }

  async loadLua(path: string, args?: (string | number)[]): Promise<boolean> {
    const scriptContent = await promisify(FS.readFile)(Path.resolve(path));
    const saferArgs = args || [];

    return new Promise((resolve, reject) =>
      Redis.getClient().EVAL(
        scriptContent.toString(),
        saferArgs.length,
        ...saferArgs,
        (err, result) => {
          if (err) {
            reject(err);

            return;
          }

          resolve(result);
        }
      )
    );
  }
}

export const redisService = new Redis();
