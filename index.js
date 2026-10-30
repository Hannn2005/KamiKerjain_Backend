import express from 'express'
import dotenv from 'dotenv'
import JasaRouter from "./routers/jasa.router.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000;

app.use(express.json())

app.use("/api/jasa",JasaRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

