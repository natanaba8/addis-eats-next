"use client";

import { useActionState } from "react";
import { createDish } from "./actions";

const initialState = { status: "idle", fieldErrors: {} };

export default function AddDishForm() {
  const [state, formAction, isSaving] = useActionState(createDish, initialState);

  return (
    <form action={formAction} className="checkout-form">
      <label>
        Dish name
        <input name="name" required minLength={2} maxLength={60} placeholder="Shiro Wat" />
        {state.fieldErrors?.name ? (
          <span role="alert">{state.fieldErrors.name[0]}</span>
        ) : null}
      </label>
      <label>
        Description
        <textarea
          name="description"
          required
          minLength={10}
          maxLength={200}
          rows={3}
          placeholder="Smooth chickpea stew simmered with garlic and berbere."
        />
        {state.fieldErrors?.description ? (
          <span role="alert">{state.fieldErrors.description[0]}</span>
        ) : null}
      </label>
      <label>
        Price (ETB)
        <input name="price" type="number" min="1" max="10000" step="1" required />
        {state.fieldErrors?.price ? (
          <span role="alert">{state.fieldErrors.price[0]}</span>
        ) : null}
      </label>
      {state.fieldErrors?.form ? <p role="alert">{state.fieldErrors.form[0]}</p> : null}
      {state.status === "error" ? <p role="alert">{state.message}</p> : null}
      <button className="primary-button" type="submit" disabled={isSaving}>
        {isSaving ? "Adding dish..." : "Add dish"}
      </button>
    </form>
  );
}
