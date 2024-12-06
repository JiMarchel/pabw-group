import { Context } from "hono";
import prisma from "../lib/prisma";

export const getCars = async (c: Context) => {
	try {
		const cars = await prisma.cars.findMany();

		const formattedCars = cars.map((car) => ({
			...car,
			price: car.price.toString(),
		}));

		return c.json({
			success: true,
			data: formattedCars,
		}, 200);
	} catch (e: unknown) {
		console.error(`Error getting cars ${e}`);
		return c.json({
			success: false,
			error: "Failed to fetch cars",
		}, 500);
	}
};

