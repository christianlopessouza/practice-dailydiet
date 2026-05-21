import { AppError } from "@/errors/AppError";
import { knex } from "@/utils/databaseConfig";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export async function deleteMeals(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteMealsSchema = z.object({
    id: z.string(),
  });

  const { id } = deleteMealsSchema.parse(request.params);
  const { userId } = request;

  const userOwnMeal = await knex("meals")
    .where({
      id,
      user_id: userId,
    })
    .first();

  if (!userOwnMeal) {
    throw new AppError("Not found", 404);
  }

  await knex("meals")
    .where({
      id,
      user_id: userId,
    })
    .delete();

  return reply.status(204).send();
}
