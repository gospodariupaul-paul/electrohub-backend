import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

// UPDATE USER PROFILE
router.put("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE "User"
      SET name = $1, email = $2, phone = $3
      WHERE id = $4
      RETURNING id, name, email, phone
      `,
      [name, email, phone, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilizatorul nu a fost găsit" });
    }

    res.json({
      message: "Profil actualizat cu succes",
      user: result.rows[0],
    });

  } catch (error) {
    console.error("Eroare la actualizare:", error);
    res.status(500).json({ message: "Eroare server" });
  }
});

export default router;
