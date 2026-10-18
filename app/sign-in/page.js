import { redirect } from "next/navigation";
import PendingSubmitButton from "../components/PendingSubmitButton";
import { signIn } from "./actions";
import { getSession } from "../menu/lib/session";
import { sanitizeNextPath } from "../menu/lib/redirects";
import { siteUrlForPath } from "../lib/site";

export const metadata = {
  title: "Sign in",
  description:
    "Sign in to Addis Eats to place orders and check the status of your meals.",
  alternates: { canonical: siteUrlForPath("/sign-in") },
  robots: { index: false, follow: false },
};

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
        <aside className="demo-credentials" aria-labelledby="demo-credentials-title">
          <p className="eyebrow">Demo access</p>
          <h2 id="demo-credentials-title">Sign in with the demo account</h2>
          <dl>
            <div>
              <dt>Username</dt>
              <dd><code>natan</code></dd>
            </div>
            <div>
              <dt>Password</dt>
              <dd><code>123456</code></dd>
            </div>
          </dl>
          <p>Demo credentials only. Do not use this password for a production account.</p>
        </aside>
        <form action={signIn} className="checkout-form">
          <input type="hidden" name="next" value={nextPath} />
          <label>
            Username
            <input name="userId" autoComplete="username" required />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          {params?.error === "invalid" ? (
            <p role="alert">The account ID or password is incorrect.</p>
          ) : null}
          <PendingSubmitButton className="primary-button" pendingLabel="Signing in...">
            Sign in
          </PendingSubmitButton>
        </form>
      </section>
    </main>
  );
}