import { beforeAll, afterAll, beforeEach } from "vitest";
import supertestRequest from "supertest";
import { app } from "../src/app";
import { knex } from "@/utils/databaseConfig";
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

beforeEach(async () => {
  await knex("meals").delete();
  await knex("users").delete();
});

export const request = () => supertestRequest(app.server);
