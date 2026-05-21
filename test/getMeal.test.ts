import { describe, it, expect, beforeEach } from "vitest";
import { request } from "./init";

describe("get a meal", () => {
  let mealId: string;
  let cookies: string[];
  beforeEach(async () => {
    const userResponse = await request().post("/users").send({
      name: "User",
      email: "a@mail.com",
    });

    const userCookies = userResponse.get("Set-Cookie");

    if (!userCookies) {
      throw new Error("Expected User A cookies");
    }

    cookies = userCookies;

    const responseMeal = await request()
      .post("/meals")
      .set("Cookie", userCookies)
      .send({
        name: "Breakfast",
        description: "Eggs",
        is_on_diet: true,
        meal_time: "2026-05-18T08:00:00.000Z",
      });

    mealId = responseMeal.body.id;
  });

  it("should return successfully", async () => {
    const response = await request()
      .get(`/meal/${mealId}`)
      .set("Cookie", cookies!)
      .send();

    const { body } = response;
    expect(response.status).toBe(200);
    expect(body.id).toBeDefined();
  });

  it("shouldnt return cause user dosnt own meal", async () => {
    const userBResponse = await request().post("/users").send({
      name: "User B",
      email: "b@mail.com",
    });

    const userBCookies = userBResponse.get("Set-Cookie");

    if (!userBCookies) {
      throw new Error("Expected User B cookies");
    }
    const cookiesB = userBCookies;

    const response = await request()
      .get(`/meal/${mealId}`)
      .set("Cookie", cookiesB!)
      .send();

    expect(response.status).toBe(404);
  });
});
