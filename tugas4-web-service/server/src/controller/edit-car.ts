import { Context } from "hono";
import { carSchema } from "../lib/type";
import prisma from "../lib/prisma";

export const editCar = async (c: Context) => {
	const body = await c.req.json()
	const validateBody = carSchema.safeParse(body)

	if (validateBody.error) {
		return c.json({
			success: false,
			message: validateBody.error
		})
	}
	const data = validateBody.data;
	const id = body.id as string;
	await prisma.cars.updateMany({
		where: {
			id
		},
		data: {
			name: data.name,
			brand: data.brand,
			model: data.model,
			price: data.price
		}
	})

	return c.json({
		success: true,
		message: "Car edited created!"
	})
}
