import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import env from './env.js'
import { register } from './register.js'
import { login } from './login.js'
import { authMiddleware } from './authMiddleware.js'

const app = new Hono()

app.post("/register", register)
app.post("/login", login)
app.get('/profile', authMiddleware, async (c) => {
  const user = c.get("jwtPayload")
  return c.json({
    success: true,
    user
  });
});

const port = env.PORT
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
