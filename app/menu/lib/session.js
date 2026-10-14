import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getUserRole } from "./auth";

export function createSessionValue(userId) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is required to create a session.");

  const signature = createHmac("sha256", secret).update(userId).digest("hex");
  return `${userId}.${signature}`;
}

function verifySessionValue(value) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || typeof value !== "string") return null;

  const separator = value.lastIndexOf(".");
  if (separator <= 0) return null;

  const userId = value.slice(0, separator);
  const signature = value.slice(separator + 1);
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(userId) || !/^[a-f0-9]{64}$/i.test(signature)) {
    return null;
  }

  const expected = createHmac("sha256", secret).update(userId).digest();
  const provided = Buffer.from(signature, "hex");
  return timingSafeEqual(expected, provided) ? userId : null;
}

export async function getSession() {
  const cookieStore = await cookies();
  const userId = verifySessionValue(cookieStore.get("session")?.value);
  const role = userId ? getUserRole(userId) : null;
  return userId && role ? { id: userId, role } : null;
}

export async function getSessionUserId() {
  return (await getSession())?.id ?? null;
}