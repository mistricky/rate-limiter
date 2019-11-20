import * as middlewares from "../middlewares";
import { Express } from "express";

export function middlewareRegister(app: Express) {
  for (const name of Object.keys(middlewares)) {
    app.use(...middlewares[name]);
  }
}
