"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateUser } from "../menu/lib/auth";
import { sanitizeNextPath } from "../menu/lib/redirects";
import { createSessionValue } from "../menu/lib/session";

export async function signIn(formData) {
  const nextPath = sanitizeNextPath(formData.get("next"));
  const account = authenticateUser(formData.get("userId"), formData.get("password"));

  if (!account) {
    redirect(`/sign-in?error=invalid&next=${encodeURIComponent(nextPath)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set("session", createSessionValue(account.id), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(nextPath);
}