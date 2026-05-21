import { AppError } from "@/errors/AppError";
import { knex } from "@/utils/databaseConfig";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function getMeal(request: FastifyRequest, reply: FastifyReply) {
  const getMealSchema = z.object({
    id: z.string(),
  });

  const { id } = getMealSchema.parse(request.params);
  const { userId } = request;
  const meal = await knex("meals").where({ user_id: userId, id }).first();
  if (!meal) {
    throw new AppError("Not found", 404);
  }

  return reply.status(200).send(meal);
}
