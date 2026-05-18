import { FastifyPluginAsync } from "fastify";
import { createMeals } from "../controllers/createMeals";
import { authCookieMiddleware } from "@/middlewares/authCookieMiddleware";
import { fetchMeals } from "@/controllers/fetchMeals";

export const mealsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", authCookieMiddleware);
  app.post("/meals", createMeals);
  app.get("/meals", fetchMeals);
};
