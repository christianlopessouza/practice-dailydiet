import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_DIR: z.string()
});

const result = envSchema.safeParse(process.env);
if (!result.success) {
  throw new Error("Invalid environment variables");
}

export const env = result.data;
