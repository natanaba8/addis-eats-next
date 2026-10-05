import { apiError } from "../../../menu/lib/api-response";
import { findDish } from "../../../menu/lib/dishes";

export async function GET(_request, { params }) {
  const { id } = await params;
  const dish = findDish(id);

  if (!dish) {
    return apiError(404, "DISH_NOT_FOUND", "Dish not found.");
  }

  return Response.json({ dish });
}