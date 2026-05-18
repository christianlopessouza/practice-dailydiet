import { FastifyPluginAsync } from "fastify";
import { createUser } from "../controllers/createUser";

export const userRoutes: FastifyPluginAsync = async (app) => {
  app.post("/users", createUser);
};
