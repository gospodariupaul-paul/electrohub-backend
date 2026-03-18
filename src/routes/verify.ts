import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

// Stocăm codurile în memorie (temporar)
const codes: Record<string, string> = {};

// Trimite cod pe email sau SMS
router.post("/verify/request", async (req: Request, res: Response) => {
  const { method } = req.body;

  // Generează cod random
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Salvăm codul pentru userul curent (exemplu simplu)
  codes["user"] = code;

  console.log("COD GENERAT:", code);

  if (method === "email") {
    // aici trimiți email real dacă ai provider
    return res.json({ success: true, message: "Cod trimis pe email" });
  }

  if (method === "phone") {
    // aici trimiți SMS real dacă ai provider
    return res.json({ success: true, message: "Cod trimis prin SMS" });
  }

  return res.status(400).json({ success: false, message: "Metodă invalidă" });
});

// Confirmă codul
router.post("/verify/confirm", async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!codes["user"]) {
    return res.json({ success: false, message: "Nu există un cod activ" });
  }

  if (codes["user"] !== code) {
    return res.json({ success: false, message: "Cod invalid" });
  }

  // Cod corect → ștergem codul
  delete codes["user"];

  return res.json({ success: true, message: "Cont verificat cu succes!" });
});

export default router;
