"use client";

import { useActionState } from "react";
import { cancelOrder, placeOrder } from "./actions";

const initialOrderState = { status: "idle", fieldErrors: {} };
const initialCancelState = { status: "idle" };

export default function CheckoutForm({ dishes }) {
  const [orderState, orderAction, isOrdering] = useActionState(
    placeOrder,
    initialOrderState,
  );
  const [cancelState, cancelAction, isCancelling] = useActionState(
    cancelOrder,
    initialCancelState,
  );

  return (
    <div className="checkout-form-wrap">
      <form action={orderAction} className="checkout-form">
        <label>
          Your name
          <input name="customerName" autoComplete="name" required minLength={2} maxLength={80} />
          {orderState.fieldErrors?.customerName ? (
            <span role="alert">{orderState.fieldErrors.customerName[0]}</span>
          ) : null}
        </label>
        <label>
          Dish
          <select name="dishId" required defaultValue={dishes[0]?.slug}>
            {dishes.map((dish) => (
              <option key={dish.slug} value={dish.slug}>
                {dish.name} - ETB {dish.price}
              </option>
            ))}
          </select>
          {orderState.fieldErrors?.dishId ? (
            <span role="alert">{orderState.fieldErrors.dishId[0]}</span>
          ) : null}
        </label>
        <label>
          Quantity
          <input name="quantity" type="number" min="1" max="20" defaultValue="1" required />
          {orderState.fieldErrors?.quantity ? (
            <span role="alert">{orderState.fieldErrors.quantity[0]}</span>
          ) : null}
        </label>
        {orderState.fieldErrors?.form ? (
          <p role="alert">{orderState.fieldErrors.form[0]}</p>
        ) : null}
        <button className="primary-button" type="submit" disabled={isOrdering}>
          {isOrdering ? "Placing order..." : "Place order"}
        </button>
      </form>

      {orderState.status === "placed" ? (
        <div className="order-result" role="status">
          <p>Order placed. Reference: {orderState.orderId}</p>
          <form action={cancelAction}>
            <input type="hidden" name="orderId" value={orderState.orderId} />
            <button className="secondary-button" type="submit" disabled={isCancelling}>
              {isCancelling ? "Cancelling..." : "Cancel order"}
            </button>
            {cancelState.status === "error" ? (
              <p role="alert">{cancelState.message}</p>
            ) : null}
            {cancelState.status === "cancelled" ? (
              <p role="status">Order cancelled.</p>
            ) : null}
          </form>
        </div>
      ) : null}
    </div>
  );
}