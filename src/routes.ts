import { FastifyPluginAsync } from "fastify";
import { createUser } from "./controllers/createUser";

export const routes: FastifyPluginAsync = async (app) => {
  app.post("/users", createUser);
};
