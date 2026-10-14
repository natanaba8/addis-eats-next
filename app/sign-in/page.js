import { redirect } from "next/navigation";
import { signIn } from "./actions";
import { getSession } from "../menu/lib/session";
import { sanitizeNextPath } from "../menu/lib/redirects";

export const dynamic = "force-dynamic";

export default async function SignInPage({ searchParams }) {
  const params = await searchParams;
  const nextPath = sanitizeNextPath(params?.next);
  if (await getSession()) redirect(nextPath);

  return (
    <main className="page-shell">
      <section className="route-card">
        <p className="eyebrow">Addis Eats account</p>
        <h1>Sign in</h1>
        <form action={signIn} className="checkout-form">
          <input type="hidden" name="next" value={nextPath} />
          <label>
            Account ID
            <input name="userId" autoComplete="username" required />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          {params?.error === "invalid" ? (
            <p role="alert">The account ID or password is incorrect.</p>
          ) : null}
          <button className="primary-button" type="submit">Sign in</button>
        </form>
      </section>
    </main>
  );
}