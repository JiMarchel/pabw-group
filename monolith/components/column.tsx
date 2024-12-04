"use client"

import { Car } from "@/app/type"
import { ColumnDef } from "@tanstack/react-table"
import { MoreActions } from "./more-actions"

export const columns: ColumnDef<Car>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "brand",
		header: "Brand",
	},
	{
		accessorKey: "model",
		header: "Model",
	},
	{
		accessorKey: "price",
		header: "Price",
		cell: ({ row }) => {
			const price = parseFloat(row.getValue("price"))
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(price)

			return <div>{formatted}</div>
		}
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const car = row.original

			return (
				<MoreActions car={car} />
			)
		},
	},
]
