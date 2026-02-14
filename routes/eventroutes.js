const express = require("express");
const { db, admin } = require("../config/firebase");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

// Get all events
router.get("/", authMiddleware, async (req, res) => {
  const snapshot = await db.collection("events").get();

  const events = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  res.json(events);
});

// Create event (admin only)
router.post("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { title, description, date, location } = req.body;

  const newEvent = await db.collection("events").add({
    title,
    description,
    date,
    location,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  res.json({ id: newEvent.id });
});

module.exports = router;
