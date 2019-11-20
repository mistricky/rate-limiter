import Express from "express";
import { Request, Response } from "express";
import { rateLimiter } from "./rate-limiter";
import { EventCenter } from "../services";

const router = Express.Router();

router.get(
  "/",
  rateLimiter(new EventCenter({ name: "root", rate: 10, limitCount: 10 })),
  (req: Request, res: Response) => {
    res.send("Hello \n Express");
  }
);

export const RootRoute = ["/", router];
