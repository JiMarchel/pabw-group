"use client"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Car } from "@/app/type"
import { CarFormEdit } from "./car-form-edit"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


export const MoreActions: React.FC<{ car: Car }> = ({ car }) => {
	const router = useRouter()

	const handleOnClick = async (id: string) => {
		try {
			const res = await fetch("http://localhost:3000/delete-car", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(id)
			})

			const result = await res.json()
			toast.success(result.message)

		} catch (e: unknown) {
			console.log(e)
		} finally {
			router.refresh()
		}

	}

	console.log(car.id)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Open menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>

				<DropdownMenuItem asChild className="cursor-pointer w-full">
					<CarFormEdit carValue={car} />
				</DropdownMenuItem>
				<DropdownMenuSeparator />

				<DropdownMenuItem onClick={() => handleOnClick(car.id)} className="bg-red-500 hover:bg-red-400 focus:bg-red-500 cursor-pointer focus:border-none ">Delete <Trash2 /></DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
