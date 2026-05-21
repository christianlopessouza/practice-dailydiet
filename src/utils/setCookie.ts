import { FastifyReply } from "fastify";

export function setCookie(reply: FastifyReply, userId: string) {
  reply.setCookie("userId", userId, {
    path: "/",
    httpOnly: true,
  });
}
