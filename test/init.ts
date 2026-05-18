import { beforeAll, afterAll } from "vitest";
import supertestRequest from "supertest";
import { app } from "../src/app";
import { knex } from "@/databaseConfig";
import "ts-node/register";

beforeAll(async () => {
  await knex.migrate.rollback(
    {
      directory: "./migrations",
      extension: "ts",
      loadExtensions: [".ts"],
    },
    true,
  );

  await knex.migrate.latest({
    directory: "./migrations",
    extension: "ts",
    loadExtensions: [".ts"],
  });
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

export const request = () => supertestRequest(app.server);
