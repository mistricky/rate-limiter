import { NextFunction, Request, Response } from "express";
import { EventCenter, redisService } from "../services";

export function rateLimiter(eventCenter: EventCenter) {
  eventCenter.init();

  return async (req: Request, res: Response, next: NextFunction) => {
    const hasToken = await redisService.loadLua("src/scripts/limiter.lua", [
      eventCenter.eventID
    ]);

    console.info(hasToken);
    if (!hasToken) {
      res.sendStatus(400);

      return;
    }

    next();
  };
}
