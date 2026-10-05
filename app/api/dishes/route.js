import { getDishesPage } from "../../menu/lib/menu-data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
  return Response.json(getDishesPage({ query, page }));
}