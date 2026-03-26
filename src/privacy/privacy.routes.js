import express from "express";
const router = express.Router();

/* ============================
   🔒 1. Blocare utilizatori
============================ */

router.post("/block", (req, res) => {
  const { targetUserId } = req.body;

  if (!targetUserId) {
    return res.status(400).json({ message: "Missing targetUserId" });
  }

  return res.json({ message: "Utilizator blocat cu succes" });
});

router.post("/unblock", (req, res) => {
  const { targetUserId } = req.body;

  if (!targetUserId) {
    return res.status(400).json({ message: "Missing targetUserId" });
  }

  return res.json({ message: "Utilizator deblocat cu succes" });
});

router.get("/blocked", (req, res) => {
  return res.json({
    blocked: [
      // aici vei pune userii blocați reali
    ],
  });
});

/* ============================
   📦 2. Export date GDPR
============================ */

router.get("/gdpr/export", (req, res) => {
  const exportData = {
    user: {
      id: "123",
      name: "Exemplu",
      email: "exemplu@mail.com",
    },
    listings: [],
    orders: [],
  };

  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="electrohub-data.json"'
  );

  return res.send(JSON.stringify(exportData, null, 2));
});

/* ============================
   ❌ 3. Ștergere cont
============================ */

router.delete("/gdpr/delete-account", (req, res) => {
  return res.json({ message: "Cont șters cu succes" });
});

export default router;
