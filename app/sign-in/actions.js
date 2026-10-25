"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateUser } from "../menu/lib/auth";
import { sanitizeNextPath } from "../menu/lib/redirects";
import { createSessionValue } from "../menu/lib/session";

export async function signIn(formData) {
  const nextPath = sanitizeNextPath(formData.get("next"));

  // Without a secret we cannot sign the cookie, so show a clear message instead of a 500 page.
  if (!process.env.SESSION_SECRET) {
    redirect(`/sign-in?error=config&next=${encodeURIComponent(nextPath)}`);
  }

  const account = authenticateUser(formData.get("userId"), formData.get("password"));

  if (!account) {
    redirect(`/sign-in?error=invalid&next=${encodeURIComponent(nextPath)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set("session", createSessionValue(account.id), {
    httpOnly: true,
    // Browsers drop Secure cookies on plain http (e.g. http://192.168.x.x:3000 in dev),
    // which made sign-in look like it did nothing. Only require https in production.
    secure: process.env.NODE_ENV === "production",
    // "lax" still blocks cross-site POSTs but keeps the user signed in when they
    // open a link to /orders from another site.
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(nextPath);
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/sign-in");
}
