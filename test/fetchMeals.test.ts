import { beforeEach, describe, expect, it } from "vitest";
import { request } from "./init";

describe("fetch meals", () => {
  let cookiesA: string[];
  beforeEach(async () => {
    const userAResponse = await request().post("/users").send({
      name: "User A",
      email: "a@mail.com",
    });

    const userACookies = userAResponse.get("Set-Cookie");

    if (!userACookies) {
      throw new Error("Expected User A cookies");
    }

    cookiesA = userACookies;

    await request().post("/meals").set("Cookie", userACookies).send({
      name: "Breakfast",
      description: "Eggs",
      is_on_diet: true,
      meal_time: "2026-05-18T08:00:00.000Z",
    });

    await request().post("/meals").set("Cookie", userACookies).send({
      name: "Lunch",
      description: "Chicken",
      is_on_diet: true,
      meal_time: "2026-05-18T12:00:00.000Z",
    });

    const userBResponse = await request().post("/users").send({
      name: "User B",
      email: "b@mail.com",
    });

    const userBCookies = userBResponse.get("Set-Cookie");

    if (!userBCookies) {
      throw new Error("Expected User B cookies");
    }

    await request().post("/meals").set("Cookie", userBCookies).send({
      name: "After Training",
      description: "Whey Protein",
      is_on_diet: true,
      meal_time: "2026-05-13T12:00:00.000Z",
    });
  });

  it("should fetch all meals from authenticated user", async () => {
    const response = await request().get("/meals").set("Cookie", cookiesA);
    expect(response.status).toBe(200);
    expect(response.body.meals).toHaveLength(2);
  });
});
