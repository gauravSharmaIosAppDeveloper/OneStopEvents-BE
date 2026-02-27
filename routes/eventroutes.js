const express = require("express");
const { db, admin } = require("../config/firebase");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();


// ================= CREATE EVENT =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, venue, dateOfEvent, timeOfEvent } = req.body;

    if (!title || !description || !venue || !dateOfEvent || !timeOfEvent) {
      return res.status(400).json({
        message: "title, description, venue, dateOfEvent and timeOfEvent are required",
      });
    }

    const eventRef = db
      .collection("users")
      .doc(req.user.uid)
      .collection("events")
      .doc();

    const eventData = {
      id: eventRef.id,
      title,
      description,
      venue,
      dateOfEvent,
      timeOfEvent,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await eventRef.set(eventData);

    res.status(201).json({
      message: "Event created successfully",
      event: eventData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create event" });
  }
});


// ================= GET ALL EVENTS =================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const snapshot = await db
      .collection("users")
      .doc(req.user.uid)
      .collection("events")
      .orderBy("createdAt", "desc")
      .get();

    const events = snapshot.docs.map(doc => doc.data());

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});


// ================= GET SINGLE EVENT =================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const doc = await db
      .collection("users")
      .doc(req.user.uid)
      .collection("events")
      .doc(req.params.id)
      .get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(doc.data());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch event" });
  }
});


// ================= UPDATE EVENT =================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, venue, dateOfEvent, timeOfEvent } = req.body;

    await db
      .collection("users")
      .doc(req.user.uid)
      .collection("events")
      .doc(req.params.id)
      .update({
        title,
        description,
        venue,
        dateOfEvent,
        timeOfEvent,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    res.json({ message: "Event updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update event" });
  }
});


// ================= DELETE EVENT =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await db
      .collection("users")
      .doc(req.user.uid)
      .collection("events")
      .doc(req.params.id)
      .delete();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete event" });
  }
});

module.exports = router;
