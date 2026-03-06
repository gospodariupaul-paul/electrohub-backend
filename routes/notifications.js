const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

// GET - încarcă setările
router.get("/settings", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT * FROM notification_settings WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        email_notifications: false,
        push_notifications: false,
        product_alerts: false,
        message_alerts: false,
        price_alerts: false
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST - salvează setările
router.post("/settings", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      email_notifications,
      push_notifications,
      product_alerts,
      message_alerts,
      price_alerts
    } = req.body;

    await pool.query(
      `
      INSERT INTO notification_settings 
      (user_id, email_notifications, push_notifications, product_alerts, message_alerts, price_alerts)
      VALUES ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (user_id)
      DO UPDATE SET
        email_notifications = EXCLUDED.email_notifications,
        push_notifications = EXCLUDED.push_notifications,
        product_alerts = EXCLUDED.product_alerts,
        message_alerts = EXCLUDED.message_alerts,
        price_alerts = EXCLUDED.price_alerts
      `,
      [
        userId,
        email_notifications,
        push_notifications,
        product_alerts,
        message_alerts,
        price_alerts
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
