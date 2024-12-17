import bcrypt from 'bcryptjs';
import type { Context } from "hono";
import { userSchema } from "./schema.js";
import prisma from "./libb/prisma.js";
import { sign } from 'hono/jwt';
import env from './env.js';

export const login = async (c: Context) => {
  const body = await c.req.json();
  const validateBody = userSchema.safeParse(body)

  if (validateBody.error) {
    return c.json({
      success: false,
      message: validateBody.error
    })
  }

  const data = validateBody.data

  const user = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  })

  if (!user) {
    return c.json({
      success: false,
      message: "Email not exist"
    })
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password)

  if (!isPasswordValid) {
    return c.json({
      success: false,
      message: "Wrong email or password"
    })
  }

  const payload = {
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
  }

  const token = await sign(payload, env.JWT_SECRET)
  return c.json({
    payload,
    token
  })

}
