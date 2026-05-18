import { knex } from "@/databaseConfig";
import { randomUUID } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.email(),
  });

  const { name, email } = createUserSchema.parse(request.body);

  const userExists = await knex("users").where("email", email).first();
  if (userExists) {
    return reply.status(401).send({
      message: "User already exists",
    });
  }

  const [data] = await knex("users")
    .insert({
      id: randomUUID(),
      name,
      email,
    })
    .returning("id");

  return reply.status(201).send(data);
}
