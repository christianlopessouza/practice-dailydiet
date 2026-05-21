import { FastifyPluginAsync } from "fastify";
import { createMeals } from "../controllers/createMeals";
import { authCookieMiddleware } from "@/middlewares/authCookieMiddleware";
import { fetchMeals } from "@/controllers/fetchMeals";
import { getMeal } from "@/controllers/getMeal";
import { editMeal } from "@/controllers/editMeal";
import { deleteMeals } from "@/controllers/deleteMeals";
import { mealMetrics } from "@/controllers/mealMetrics";

export const mealsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", authCookieMiddleware);
  app.post("/meals", createMeals);
  app.get("/meals", fetchMeals);
  app.delete("/meals/:id", deleteMeals);
  app.get("/meals/metrics", mealMetrics);
  app.get("/meal/:id", getMeal);
  app.patch("/meal/:id", editMeal);
};
