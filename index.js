import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import privacyRoutes from "./src/privacy/privacy.routes.js";
app.use("/privacy", privacyRoutes);

dotenv.config();

const app = express();

// 🔥 CORS CORECT PENTRU VERCEL + LOCALHOST
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://electrohub-frontend.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// 🔥 CONECTARE LA MONGO
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// 🔥 RUTE
import authRoutes from "./src/auth/auth.routes.js";
app.use("/auth", authRoutes);

// 🔥 PORNIRE SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
