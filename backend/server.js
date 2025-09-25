import dotenv from "dotenv";
import express from 'express';
import path from "path";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRoutes from "./Routes/library.routes.js";
import authRoutes from "./Routes/auth.routes.js";
import miscRoutes from "./Routes/misc.routes.js";

dotenv.config();

const app = express();

const __dirname = path.resolve()

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json())
app.use(cookieParser())

app.use("/api/library", userRoutes);
app.use("/api/auth", authRoutes)
app.use("/api/misc", miscRoutes)

app.use(express.static(path.join(__dirname, "/frontend/dist/")))

app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})

// const port = process.env.PORT || 5000;

// app.listen(port, () => {
//     console.log(`Server is running on PORT - ${port}`)
// })

module.exports = app;