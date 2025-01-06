import { DataTable } from "@/components/data-table";
import { columns } from "@/components/column";
import { CarFormCreate } from "@/components/car-form-create";


const Home = async () => {
  const getData = await fetch("http://localhost:3000/get-cars");
  const data = await getData.json()

  return (
    <div className="px-10">
      <div>
        <h1 className="my-10 text-4xl font-bold">Web Service | Cars Project</h1>
      </div>
      <div className="mb-3">
        <CarFormCreate title="Create" className="bg-primary w-fit text-white rounded font-medium px-5 py-2 hover:bg-primary/90" />
      </div>
      <DataTable data={data.data.reverse()} columns={columns} />
    </div>
  );
}

export default Home;

