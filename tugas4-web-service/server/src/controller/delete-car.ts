import { Context } from "hono";
import prisma from "../lib/prisma";

export const deleteCar = async (c: Context) => {
	const id = await c.req.json()

	if (!id) {
		return c.json({
			success: false,
			message: "Id is required"
		})
	}

	await prisma.cars.delete({
		where: {
			id
		}
	})

	return c.json({
		success: true,
		message: "Car deleted successfully"
	})
}
