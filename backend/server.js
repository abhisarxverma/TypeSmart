import dotenv from "dotenv";
import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRoutes from "./Routes/library.routes.js";
import authRoutes from "./Routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Welcome to typefreaks")
})

app.use("/api/library", userRoutes);
app.use("/api/auth", authRoutes)

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on PORT - ${port}`)
})
