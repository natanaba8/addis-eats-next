"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addDish, listDishes } from "../lib/dishes";
import { validateDish } from "../lib/dish-schema";
import { getSession } from "../lib/session";

function dishDataFromForm(formData) {
  return {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
  };
}

export async function createDish(_previousState, formData) {
  // The role comes from the signed session on the server, never from the form.
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { status: "error", message: "Only an administrator can add dishes." };
  }

  const existingSlugs = listDishes().map((dish) => dish.slug);
  const result = validateDish(dishDataFromForm(formData), existingSlugs);
  if (!result.success) {
    return { status: "invalid", fieldErrors: result.fieldErrors };
  }

  const dish = addDish(result.data);
  // Refresh the menu list, the sidebar in the menu layout, and the dish pages.
  revalidatePath("/menu", "layout");
  revalidatePath("/checkout");
  revalidatePath("/sitemap.xml");

  redirect(`/menu/${dish.slug}`);
}
