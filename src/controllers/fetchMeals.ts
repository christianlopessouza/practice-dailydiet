import { knex } from "@/utils/databaseConfig";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function fetchMeals(request: FastifyRequest, reply: FastifyReply) {
  const { userId } = request;
  const mealsList = await knex("meals").where("user_id", userId);

  return reply.status(200).send({ meals: mealsList });
}
