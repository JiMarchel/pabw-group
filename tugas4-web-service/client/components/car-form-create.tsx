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
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"
import { Car, carSchema } from "@/app/type"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { DialogDescription } from "@radix-ui/react-dialog"

interface CarFormProps {
	title: string
	className?: string
	carValue?: Car
}


export const CarFormCreate = ({ title, className, carValue }: CarFormProps) => {
	const router = useRouter()
	const [open, setOpen] = useState(false);

	const form = useForm<z.infer<typeof carSchema>>({
		resolver: zodResolver(carSchema),
		defaultValues: {
			name: carValue?.name || "",
			brand: carValue?.brand || "",
			model: carValue?.model || "",
			price: carValue?.price || 0
		}
	})

	const onSubmit = async (value: z.infer<typeof carSchema>) => {
		const data = {
			...value,
			price: BigInt(value.price).toString()
		}
		try {
			const res = await fetch("http://localhost:3000/create-car", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data)
			})

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || 'Something went wrong');
			}

			const result = await res.json()
			toast.success(result.message)

		} catch (e: unknown) {
			console.log(e)
		} finally {
			router.refresh()
			setOpen(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<p className={cn("flex gap-2 items-center text-sm cursor-pointer", className)}>{title} {title === "Create" ? <Plus size={20} /> : <Edit3 size={20} />}</p>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-2xl">Create Car</DialogTitle>
					<DialogDescription>{title} mobil</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						{carValue && <input name="id" defaultValue={carValue.id} className="hidden" />}
						<FormField control={form.control} name="name" render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="Name..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)} />
						<FormField control={form.control} name="brand" render={({ field }) => (
							<FormItem>
								<FormLabel>Brand</FormLabel>
								<FormControl>
									<Input placeholder="Brand..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)} />
						<FormField control={form.control} name="model" render={({ field }) => (
							<FormItem>
								<FormLabel>Model</FormLabel>
								<FormControl>
									<Input placeholder="Model..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)} />
						<FormField control={form.control} name="price" render={({ field }) => (
							<FormItem>
								<FormLabel>Price</FormLabel>
								<FormControl>
									<Input placeholder="Price..." type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)} />
						<div >
							<Button className="w-full" >Submit</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
