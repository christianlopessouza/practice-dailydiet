import { knex } from "@/databaseConfig";
import { randomUUID } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function createMeals(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createMealSchema = z.object({
    name: z.string(),
    description: z.string(),
    is_on_diet: z.boolean(),
    meal_time: z.coerce.date(),
  });

  const userId = request.userId;

  const {
    name,
    description,
    is_on_diet: isOnDiet,
    meal_time: mealTime,
  } = createMealSchema.parse(request.body);

  const [data] = await knex("meals")
    .insert({
      id: randomUUID(),
      name,
      description,
      is_on_diet: isOnDiet,
      meal_time: mealTime,
      user_id: userId,
    })
    .returning("id");

  return reply.status(201).send(data);
}
