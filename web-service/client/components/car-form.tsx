"use client"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Edit3, Plus } from "lucide-react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { useActionState } from "react"
import { cn } from "@/lib/utils"
import { Car } from "@/app/type"

// interface CarFormProps {
// 	title: string
// 	className?: string
// 	action: typeof createCar
// 	carValue?: Car
// }

export const CarForm = ({ title, className, action, carValue }: CarFormProps) => {
	// const [data, formAction, isPending] = useActionState(action, undefined)

	return (
		<Dialog >
			<DialogTrigger asChild>
				<p className={cn("flex gap-2 items-center text-sm cursor-pointer", className)}>{title} {title === "Create" ? <Plus size={20} /> : <Edit3 size={20} />}</p>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-2xl">Create Car</DialogTitle>
				</DialogHeader>
				<form className="space-y-4" action={formAction}>
					{carValue && <input name="id" defaultValue={carValue.id} className="hidden" />}
					<div>
						<Label htmlFor="name">Name</Label>
						<Input name="name" id="name" placeholder="Name..." defaultValue={carValue?.name} />
						{data?.errors?.name && (
							<p className="text-red-500">{data.errors.name}</p>
						)}
					</div>
					<div>
						<Label htmlFor="brand">Brand</Label>
						<Input name="brand" id="brand" placeholder="Brand..." defaultValue={carValue?.brand} />
						{data?.errors?.brand && (
							<p className="text-red-500">{data.errors.brand}</p>
						)}
					</div>
					<div>
						<Label htmlFor="model">Model</Label>
						<Input name="model" id="model" placeholder="Model..." defaultValue={carValue?.model} />
						{data?.errors?.model && (
							<p className="text-red-500">{data.errors.model}</p>
						)}
					</div>
					<div>
						<Label htmlFor="price">Price</Label>
						<Input name="price" id="price" type="number" placeholder="Price..." defaultValue={carValue?.price?.toString()} />
						{data?.errors?.price && (
							<p className="text-red-500">{data.errors.price}</p>
						)}
					</div>
					<div >
						<Button className="w-full" disabled={isPending}>Submit</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
