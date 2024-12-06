import { Context } from "hono";
import { carSchema } from "../lib/type";
import prisma from "../lib/prisma";

export const createCar = async (c: Context) => {
	const body = await c.req.json()
	const validateBody = carSchema.safeParse(body)

	if (validateBody.error) {
		return c.json({
			success: false,
			message: validateBody.error
		})
	}
	const data = validateBody.data;
	await prisma.cars.create({
		data: {
			name: data.name,
			brand: data.brand,
			model: data.model,
			price: data.price
		}
	})

	return c.json({
		success: true,
		message: "Car successfully created!"
	})
}
