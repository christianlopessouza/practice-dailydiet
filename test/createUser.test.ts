import { describe, it, expect } from "vitest";
import { request } from "./init";

describe("create user", () => {
  const data = {
    name: "John Doe",
    email: "johndoe@mail.com",
  };

  it("should create successfully", async () => {
    const response = await request().post("/users").send(data);
    expect(response.status).toBe(201);
    expect(response.body.id).toBeTypeOf("string");
  });
  it("shouldnt create", async () => {
    await request().post("/users").send(data);
    const response = await request().post("/users").send(data);

    expect(response.status).toBe(401);
  });
});
