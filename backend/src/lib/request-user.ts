import type { FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

type JwtPayload = {
  sub: string;
};

export function setUserIdFromAuthHeader(request: FastifyRequest) {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    request.userId = undefined;
    return;
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    request.userId = payload.sub;
  } catch {
    request.userId = undefined;
  }
}
