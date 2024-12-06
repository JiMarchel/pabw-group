import { Hono } from 'hono'
import { cors } from "hono/cors"
import { getCars } from './controller/get-cars'
import { createCar } from './controller/create-car';
import { editCar } from './controller/edit-car';
import { deleteCar } from './controller/delete-car';

const app = new Hono()

app.use("/*", cors({ origin: "*" }))
app.get("/get-cars", (c) => getCars(c));
app.post("/create-car", (c) => createCar(c))
app.put("/edit-car", (c) => editCar(c))
app.delete("/delete-car", (c) => deleteCar(c))


export default app
