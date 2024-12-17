import { expand } from "dotenv-expand"
import { config } from "dotenv"
import { z, ZodError } from "zod"

expand(config())
const EnvSchema = z.object({
  PORT: z.coerce.number().default(5053),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string()
})

export type env = z.infer<typeof EnvSchema>
let env: env;

try {
  env = EnvSchema.parse(process.env);
} catch (e) {
  const error = e as ZodError;
  console.log("Invalid env:")
  console.log(error.flatten());
  process.exit(1)
}

export default env
