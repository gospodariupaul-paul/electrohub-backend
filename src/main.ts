import express from "express";
import cors from "cors";
import routes from "./routes"; // dacă ai un folder routes
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

// CORS FIX PENTRU VERCEL
app.use(
  cors({
    origin: "https://electrohub-frontend.vercel.app",
    credentials: true,
  })
);

// Dacă ai rute:
app.use("/", routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
