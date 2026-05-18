import { describe, it, expect } from "vitest";
import { request } from "./init";

describe("create meal", () => {
  const data = {
    name: "Soap",
    description: "Default description",
    is_on_diet: true,
    meal_time: "2026-05-18T12:00:00.000Z",
  };

  it("should create successfully", async () => {
    const createUserResponse = await request().post("/users").send({
      name: "John Doe",
      email: "johndoe@mail.com",
    });
    const cookies = createUserResponse.get("Set-Cookie");
    expect(cookies).toBeDefined();

    const response = await request()
      .post("/meals")
      .set("Cookie", cookies!)
      .send(data);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeTypeOf("string");
  });
  it("shouldnt create", async () => {
    const response = await request().post("/meals").send(data);
    expect(response.status).toBe(403);
  });
});
