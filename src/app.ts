import fastify from "fastify";
import { userRoutes } from "./routes/usersRoutes";
import { mealsRoutes } from "./routes/mealsRoutes";
import cookie from "@fastify/cookie";
import { AppError } from "./errors/AppError";

export const app = fastify();

app.register(cookie);
app.register(userRoutes);
app.register(mealsRoutes);

app.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
    });
  }

  return reply.status(500).send({
    message: "Internal server error",
  });
});
