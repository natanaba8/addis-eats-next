import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

function getConfiguredUsers() {
  // Values copied from `.env.local` into a hosting dashboard often keep the
  // surrounding quotes, which are not valid JSON, so strip them first.
  const raw = (process.env.AUTH_USERS ?? "").trim().replace(/^(['"])([\s\S]*)\1$/, "$2");
  if (!raw) {
    console.error("AUTH_USERS is not set, so no account can sign in.");
    return [];
  }

  try {
    const users = JSON.parse(raw);
    if (Array.isArray(users)) return users;
    console.error("AUTH_USERS must be a JSON array of accounts.");
  } catch {
    console.error("AUTH_USERS is not valid JSON, so no account can sign in.");
  }
  return [];
}

const ELEVATED_ROLES = ["staff", "admin"];

function roleFor(user) {
  return ELEVATED_ROLES.includes(user.role) ? user.role : "customer";
}

export function getUserRole(userId) {
  const user = getConfiguredUsers().find((candidate) => candidate.id === userId);
  return user ? roleFor(user) : null;
}

export function authenticateUser(userId, password) {
  if (typeof userId !== "string" || typeof password !== "string") return null;
  const user = getConfiguredUsers().find((candidate) => candidate.id === userId);
  if (!user || typeof user.password !== "string") return null;

  const submittedHash = createHash("sha256").update(password).digest();
  const configuredHash = createHash("sha256").update(user.password).digest();
  if (!timingSafeEqual(submittedHash, configuredHash)) return null;

  return { id: user.id, role: roleFor(user) };
}