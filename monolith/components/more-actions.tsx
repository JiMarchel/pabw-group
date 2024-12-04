import { MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Car } from "@/app/type"
import { deleteCar } from "@/action/delete"
import { CarForm } from "./car-form"
import { updateCar } from "@/action/update"


export const MoreActions: React.FC<{ car: Car }> = ({ car }) => {


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
					<CarForm title="Edit" carValue={car} action={updateCar} />
				</DropdownMenuItem>
				<DropdownMenuSeparator />

				<form action={deleteCar}>
					<input defaultValue={car.id} name="id" className="hidden" />
					<button type="submit" className="w-full">
						<DropdownMenuItem className="bg-red-500 hover:bg-red-400 focus:bg-red-500 cursor-pointer focus:border-none ">Delete <Trash2 /></DropdownMenuItem>
					</button>
				</form>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
