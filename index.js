import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000;

app.use(express.json())

app.get("/", (req, res) => {
  res.status(200).json({
    message: "tests route",
    environment: process.env.NODE_ENV,
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

