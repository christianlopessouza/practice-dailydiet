import { AppError } from "@/errors/AppError";
import { knex } from "@/utils/databaseConfig";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function editMeal(request: FastifyRequest, reply: FastifyReply) {
  const editMealParamsSchema = z.object({
    id: z.string(),
  });

  const editFieldsSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    is_on_diet: z.boolean().optional(),
    meal_time: z.coerce.date().optional(),
  });

  const { userId } = request;

  const { id } = editMealParamsSchema.parse(request.params);

  const data = editFieldsSchema.parse(request.body);

  const meal = await knex("meals")
    .where({
      user_id: userId,
      id,
    })
    .first();

  if (!meal) {
    throw new AppError("Not found", 404);
  }

  await knex("meals").where({ id }).update(data);

  return reply.status(200).send();
}
