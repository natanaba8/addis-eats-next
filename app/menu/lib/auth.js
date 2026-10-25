import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

function getConfiguredUsers() {
  try {
    const users = JSON.parse(process.env.AUTH_USERS ?? "[]");
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
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