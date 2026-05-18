import { AppError } from "@/AppError";
import { knex } from "@/databaseConfig";
import { setCookie } from "@/setCookie";
import { FastifyReply, FastifyRequest } from "fastify";

export async function authCookieMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const cookieUserId = request.cookies.userId;
  const headerUserId = request.headers["x-user-id"];

  if (Array.isArray(headerUserId)) {
    throw new AppError("Invalid Authorization", 403);
  }

  const userId = headerUserId || cookieUserId;

  if (!userId) {
    throw new AppError("Invalid Authorization", 403);
  }

  const userExist = await knex("users").where("id", userId).first();
  if (!userExist) {
    throw new AppError("Invalid Authorization", 403);
  }

  if (headerUserId && headerUserId !== cookieUserId) {
    setCookie(reply, headerUserId);
  }
  request.userId = userId;
}
