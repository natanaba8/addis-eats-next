import { findDish } from "./dishes";

export function validateOrder(input) {
  const fieldErrors = {};

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {
      success: false,
      fieldErrors: { form: ["Provide order details as an object."] },
    };
  }

  const dishId = typeof input.dishId === "string" ? input.dishId.trim() : "";
  const customerName =
    typeof input.customerName === "string" ? input.customerName.trim() : "";
  const quantity = Number(input.quantity);

  if (!findDish(dishId)) {
    fieldErrors.dishId = ["Choose a valid dish."];
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    fieldErrors.quantity = ["Quantity must be a whole number from 1 to 20."];
  }
  if (customerName.length < 2 || customerName.length > 80) {
    fieldErrors.customerName = ["Name must be between 2 and 80 characters."];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  return {
    success: true,
    data: { dishId, quantity, customerName },
  };
}