import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
    cookies: FastifyRequest["cookies"] & {
      userId?: string;
    };
  }
}
