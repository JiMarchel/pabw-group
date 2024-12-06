import { DataTable } from "@/components/data-table";
import { columns } from "@/components/column";
import { CarForm } from "@/components/car-form";
import { Car } from "./type";


const Home = async () => {
	const data: Car[] = [
		{
			id: "alsddald",
			name: "ajsbdkaj0",
			brand: "alnakd",
			model: "nnclksnc",
			price: BigInt(182736)
		}

	]


	return (
		<div className="px-10">
			<div>
				<h1 className="my-10 text-4xl font-bold">Monolith | Cars Project</h1>
			</div>
			<div className="mb-3">
				{/* <CarForm title="Create" className="bg-primary w-fit text-white rounded font-medium px-5 py-2 hover:bg-primary/90" action={createCar} /> */}
			</div>
			<DataTable data={data} columns={columns} />
		</div>
	);
}

export default Home;

