"use client";

import { useFormStatus } from "react-dom";

export default function PendingSubmitButton({ children, pendingLabel, className }) {
  const { pending } = useFormStatus();

  return (
    <button className={className} type="submit" disabled={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}