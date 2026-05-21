import { knex } from "@/utils/databaseConfig";
import type { FastifyReply, FastifyRequest } from "fastify";

type Metrics = {
  total_meals: number;
  total_on_diet: number;
  total_off_diet: number;
  best_on_diet_streak: number;
};

type MetricsRow = Metrics;

export async function mealMetrics(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.userId!;

  const mealMetricsQuery = await knex.raw(
    `
    WITH ordered AS (
      SELECT
        user_id,
        is_on_diet,
        meal_time,
        SUM(CASE WHEN is_on_diet = 0 THEN 1 ELSE 0 END)
          OVER (PARTITION BY user_id ORDER BY meal_time) AS streak_group
      FROM meals
      WHERE user_id = ?
    ),
    streaks AS (
      SELECT
        user_id,
        streak_group,
        SUM(CASE WHEN is_on_diet = 1 THEN 1 ELSE 0 END) AS streak_len
      FROM ordered
      GROUP BY user_id, streak_group
    )
    SELECT
      (SELECT COUNT(*) FROM meals WHERE user_id = ?) AS total_meals,
      (SELECT COUNT(*) FROM meals WHERE user_id = ? AND is_on_diet = 1) AS total_on_diet,
      (SELECT COUNT(*) FROM meals WHERE user_id = ? AND is_on_diet = 0) AS total_off_diet,
      COALESCE((SELECT MAX(streak_len) FROM streaks), 0) AS best_on_diet_streak
    `,
    [userId, userId, userId, userId],
  );

  const rawResult: unknown = mealMetricsQuery;

  let rows: MetricsRow[];

  if (Array.isArray(rawResult)) {
    if (rawResult.length > 0 && Array.isArray(rawResult[0])) {
      rows = rawResult[0] as MetricsRow[];
    } else {
      rows = rawResult as MetricsRow[];
    }
  } else {
    rows = [];
  }

  const mealMetricsResult = rows[0];
  if (!mealMetricsResult) {
    return reply.status(200).send({
      total_meals: 0,
      total_on_diet: 0,
      total_off_diet: 0,
      best_on_diet_streak: 0,
    });
  }

  const metrics: Metrics = {
    total_meals: Number(mealMetricsResult.total_meals),
    total_on_diet: Number(mealMetricsResult.total_on_diet),
    total_off_diet: Number(mealMetricsResult.total_off_diet),
    best_on_diet_streak: Number(mealMetricsResult.best_on_diet_streak),
  };

  return reply.status(200).send(metrics);
}
