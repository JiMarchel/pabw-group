import type { Context, Next } from "hono";
import { verify } from "hono/jwt";
import env from "./env.js";

export const authMiddleware = async (c: Context, next: Next) => {
  const authToken = c.req.header("Authorization")?.replace("Bearer ", "")
  if (!authToken) {
    return c.json({
      success: false,
      message: "Invalid credentials"
    })
  }

  try {
    const decoded = await verify(authToken, env.JWT_SECRET);
    console.log(decoded)
    c.set("jwtPayload", decoded);

    // Lanjutkan ke middleware berikutnya
    await next();

    // Respon default jika middleware terakhir
    if (!c.finalized) {
      return c.text("Request processed successfully");
    }
  } catch (error) {
    return c.json({ message: `Login failed ${error}` })
  }
}
