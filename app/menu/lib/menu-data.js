import { dishes } from "./dishes";

export const DISH_PAGE_SIZE = 2;

export function getDishesPage({ query = "", page = 1 } = {}) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matchingDishes = normalizedQuery
    ? dishes.filter((dish) =>
        `${dish.name} ${dish.description}`.toLocaleLowerCase().includes(normalizedQuery),
      )
    : dishes;
  const totalPages = Math.max(1, Math.ceil(matchingDishes.length / DISH_PAGE_SIZE));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const start = (currentPage - 1) * DISH_PAGE_SIZE;

  return {
    dishes: matchingDishes.slice(start, start + DISH_PAGE_SIZE),
    page: currentPage,
    pageSize: DISH_PAGE_SIZE,
    total: matchingDishes.length,
    totalPages,
    query: query.trim(),
  };
}