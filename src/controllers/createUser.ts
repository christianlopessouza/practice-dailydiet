import { knex } from "@/databaseConfig";
import { randomUUID } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { AppError } from "@/AppError";
import { setCookie } from "@/setCookie";

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.email(),
  });

  const { name, email } = createUserSchema.parse(request.body);

  const userExists = await knex("users").where("email", email).first();
  if (userExists) {
    throw new AppError("User already exists", 401);
  }

  const userId = randomUUID();

  await knex("users").insert({
    id: userId,
    name,
    email,
  });

  setCookie(reply, userId);

  return reply.status(201).send({
    id: userId,
  });
}
