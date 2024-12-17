import bcrypt from 'bcryptjs';
import type { Context } from "hono";
import { userSchema } from "./schema.js";
import prisma from "./libb/prisma.js";

export const register = async (c: Context) => {
  const body = await c.req.json()
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

  if (user) {
    return c.json({
      success: false,
      message: "Email already used"
    })
  }


  const hashedPassword = await bcrypt.hash(data.password, 10)

  await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword
    }
  })

  return c.json({
    success: true,
    message: 'User registered successfully'
  });
}
