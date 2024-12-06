"use server"

import { carSchema } from "@/app/type"
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateCar = async (_: unknown, formData: FormData) => {
	const carFormData = Object.fromEntries(formData);
	const validateCarFormData = carSchema.safeParse(carFormData)

	if (!validateCarFormData.success) {
		const formFieldErrors = validateCarFormData.error.flatten().fieldErrors;

		return {
			errors: {
				name: formFieldErrors?.name,
				brand: formFieldErrors?.brand,
				model: formFieldErrors?.model,
				price: formFieldErrors?.price
			}
		}
	}
	const parsedData = validateCarFormData.data;
	const id = formData.get("id") as string

	await prisma.cars.update({
		where: {
			id
		},
		data: {
			name: parsedData.name,
			brand: parsedData.brand,
			model: parsedData.model,
			price: parsedData.price
		}
	})

	revalidatePath("/")
	return { success: true }
}
