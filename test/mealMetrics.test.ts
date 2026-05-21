import { describe, it, expect, beforeEach } from "vitest";
import { request } from "./init";

describe("get user meal metrics", () => {
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

    await request().post("/meals").set("Cookie", userCookies).send({
      name: "Breakfast",
      description: "Eggs",
      is_on_diet: true,
      meal_time: "2026-05-18T08:00:00.000Z",
    });

    await request().post("/meals").set("Cookie", userCookies).send({
      name: "Dinner",
      description: "Meat and Rice",
      is_on_diet: false,
      meal_time: "2026-05-19T08:00:00.000Z",
    });

    await request().post("/meals").set("Cookie", userCookies).send({
      name: "Launch",
      description: "Brocollis",
      is_on_diet: true,
      meal_time: "2026-05-22T08:00:00.000Z",
    });
    await request().post("/meals").set("Cookie", userCookies).send({
      name: "My Holy Bread",
      description: "Bread",
      is_on_diet: true,
      meal_time: "2026-05-30T08:00:00.000Z",
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
      name: "My Holy Bread",
      description: "Bread",
      is_on_diet: true,
      meal_time: "2026-05-30T08:00:00.000Z",
    });
  });

  it("should return successfully", async () => {
    const response = await request()
      .get(`/meals/metrics`)
      .set("Cookie", cookies!)
      .send();

    const { body } = response;
    expect(response.status).toBe(200);
    expect(body.total_meals).toBe(4);
    expect(body.total_on_diet).toBe(3);
    expect(body.total_off_diet).toBe(1);
    expect(body.best_on_diet_streak).toBe(2);
  });

  it("should return zeroed metrics when user has no meals", async () => {
    const userResponse = await request().post("/users").send({
      name: "User Without Meals",
      email: "empty@mail.com",
    });

    const userCookies = userResponse.get("Set-Cookie");

    if (!userCookies) {
      throw new Error("Expected empty user cookies");
    }

    const response = await request()
      .get(`/meals/metrics`)
      .set("Cookie", userCookies)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      total_meals: 0,
      total_on_diet: 0,
      total_off_diet: 0,
      best_on_diet_streak: 0,
    });
  });

  it("should calculate best streak between off-diet meals", async () => {
    const userResponse = await request().post("/users").send({
      name: "User C",
      email: "c@mail.com",
    });

    const userCookies = userResponse.get("Set-Cookie");

    if (!userCookies) {
      throw new Error("Expected User C cookies");
    }

    const meals = [
      { name: "Off start", is_on_diet: false, meal_time: "2026-05-01T08:00:00.000Z" },
      { name: "On one", is_on_diet: true, meal_time: "2026-05-02T08:00:00.000Z" },
      { name: "On two", is_on_diet: true, meal_time: "2026-05-03T08:00:00.000Z" },
      { name: "Off end", is_on_diet: false, meal_time: "2026-05-04T08:00:00.000Z" },
    ];

    for (const meal of meals) {
      await request()
        .post("/meals")
        .set("Cookie", userCookies)
        .send({
          ...meal,
          description: "Streak fixture",
        });
    }

    const response = await request()
      .get(`/meals/metrics`)
      .set("Cookie", userCookies)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.total_meals).toBe(4);
    expect(response.body.total_on_diet).toBe(2);
    expect(response.body.total_off_diet).toBe(2);
    expect(response.body.best_on_diet_streak).toBe(2);
  });
});
