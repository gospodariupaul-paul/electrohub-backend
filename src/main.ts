import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

// Body parser
app.use(bodyParser.json());

// CORS FIX PENTRU VERCEL
app.use(
  cors({
    origin: "https://electrohub-frontend.vercel.app",
    credentials: true,
  })
);

// Exemplu de rută login (dacă ai alta, las-o pe a ta)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Aici probabil folosești hash.js pentru verificare
  // Eu las doar un exemplu minimal
  if (email === "test@test.com" && password === "290372") {
    return res.json({ token: "TOKEN_EXEMPLU" });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
