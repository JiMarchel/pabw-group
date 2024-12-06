"use client"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Edit3 } from "lucide-react"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"
import { Car, editCarSchema } from "@/app/type"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { DialogDescription } from "@radix-ui/react-dialog"

interface CarFormProps {
	carValue?: Car
}


export const CarFormEdit = ({ carValue }: CarFormProps) => {
	const router = useRouter()
	const [open, setOpen] = useState(false);

	const form = useForm<z.infer<typeof editCarSchema>>({
		resolver: zodResolver(editCarSchema),
		defaultValues: {
			id: carValue?.id,
			name: carValue?.name,
			brand: carValue?.brand,
			model: carValue?.model,
			price: carValue?.price
		}
	})

	const onSubmit = async (value: z.infer<typeof editCarSchema>) => {
		const data = {
			...value,
			price: BigInt(value.price).toString()
		}
		try {
			const res = await fetch("http://localhost:3000/edit-car", {
				method: "PUT",
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
				<p className={cn("flex gap-2 items-center text-sm cursor-pointer ml-2")}>Edit <Edit3 size={20} /></p>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-2xl">Create Car</DialogTitle>
					<DialogDescription>Edit mobil</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField control={form.control} name="id" render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder="Id..." {...field} className="hidden" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)} />
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
