"use server";

import { revalidatePath } from "next/cache";
import { createOrder, findOrder, updateOrder } from "../menu/lib/orders";
import { validateOrder } from "../menu/lib/order-schema";
import { getSessionUserId } from "../menu/lib/session";

function orderDataFromForm(formData) {
  return {
    dishId: formData.get("dishId"),
    quantity: formData.get("quantity"),
    customerName: formData.get("customerName"),
  };
}

export async function placeOrder(_previousState, formData) {
  const result = validateOrder(orderDataFromForm(formData));
  if (!result.success) {
    return { status: "invalid", fieldErrors: result.fieldErrors };
  }

  const order = createOrder(result.data, await getSessionUserId());
  revalidatePath("/menu");
  revalidatePath("/checkout");

  return { status: "placed", orderId: order.id };
}

export async function cancelOrder(_previousState, formData) {
  const userId = await getSessionUserId();
  if (!userId) {
    return { status: "error", message: "Sign in to cancel this order." };
  }

  const orderId = formData.get("orderId");
  const order = typeof orderId === "string" ? findOrder(orderId) : null;
  if (!order || order.ownerId !== userId) {
    return { status: "error", message: "Order not found or not owned by this session." };
  }

  updateOrder(order.id, { status: "cancelled" });
  revalidatePath("/menu");
  revalidatePath("/checkout");

  return { status: "cancelled" };
}