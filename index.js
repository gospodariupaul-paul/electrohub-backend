const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "https://electrohub-frontend-git-main-gospodariupaul-pauls-projects.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@gmail.com" && password === "123456") {
    res.cookie("token", "123", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.json({ message: "Logged in" });
  }

  return res.status(401).json({ message: "Email sau parolă greșită" });
});

app.get("/auth/me", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Neautorizat" });
  }

  return res.json({ email: "admin@gmail.com" });
});

app.post("/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return res.json({ message: "Logged out" });
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log("Backend running on port " + port));
