import { z } from "zod"

export const carSchema = z.object({
	name: z.string().min(1, { message: "Name field is required!" }),
	brand: z.string().min(1, { message: "Brand field is required!" }),
	model: z.string().min(1, { message: "Model field is reqired!" }),
	price: z.coerce.bigint().positive()
})

export type Car = z.infer<typeof carSchema> & { id: string }

