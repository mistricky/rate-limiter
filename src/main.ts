import Express from "express";
import { port } from "./configs/serve.json";
import { middlewareRegister } from "./utils";

const App = Express();

// register middlewares
middlewareRegister(App);

App.listen(port, () => console.info(`listening on ${port}`));
