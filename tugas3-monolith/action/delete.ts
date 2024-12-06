"use server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const deleteCar = async (formData: FormData) => {
	const id = formData.get("id") as string

	await prisma.cars.delete({
		where: {
			id: id
		}
	})

	revalidatePath("/")
}
