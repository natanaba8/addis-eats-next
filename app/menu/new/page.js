import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AddDishForm from "./AddDishForm";
import { getSession } from "../lib/session";

export const metadata = {
  title: "Add a dish",
  description: "Administrators can add a new dish to the Addis Eats menu.",
  robots: { index: false, follow: false },
};

// This page reads the session cookie, so it must render on each request.
export const dynamic = "force-dynamic";

export default async function AddDishPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=%2Fmenu%2Fnew");
  if (session.role !== "admin") notFound();

  return (
    <main className="page-shell">
      <section className="route-card">
        <p className="eyebrow">Admin</p>
        <h1>Add a dish</h1>
        <p>New dishes appear on the menu, in the sidebar, and in checkout right away.</p>
        <AddDishForm />
        <Link href="/menu" className="secondary-button">
          Back to menu
        </Link>
      </section>
    </main>
  );
}
