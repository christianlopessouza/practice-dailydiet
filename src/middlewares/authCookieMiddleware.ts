import { AppError } from "@/AppError";
import { knex } from "@/databaseConfig";
import { setCookie } from "@/setCookie";
import { FastifyReply, FastifyRequest } from "fastify";

type AuthRequest = FastifyRequest & {
  cookies: {
    userId?: string;
  };
  headers: {
    "x-user-id"?: string;
  };
};

export async function authCookieMiddleware(
  request: AuthRequest,
  reply: FastifyReply,
) {
  const cookieUserId = request.cookies.userId;
  const headerUserId = request.headers["x-user-id"];
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
}
