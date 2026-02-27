const express = require("express");
const { db, admin } = require("../config/firebase");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router({ mergeParams: true });


// ================= CREATE GUEST =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;

    const {
      name,
      number,
      gender,
      rsvpStatus,
      foodPreference,
      groups,
      address,
    } = req.body;

    if (!name || !number || !gender || !rsvpStatus || !foodPreference || !groups) {
      return res.status(400).json({
        message:
          "name, number, gender, rsvpStatus, foodPreference and groups are required",
      });
    }

    const guestRef = db
      .collection("users")
      .doc(req.user.uid)
      .collection("events")
      .doc(eventId)
      .collection("guests")
      .doc();

    const guestData = {
      id: guestRef.id,
      name,
      number,
      gender,
      rsvpStatus,
      foodPreference,
      groups,
      address: address || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await guestRef.set(guestData);

    res.status(201).json({
      message: "Guest added successfully",
      guest: guestData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add guest" });
  }
});


// ================= GET ALL GUESTS =================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;

    const snapshot = await db
      .collection("users")
      .doc(req.user.uid)
      .collection("events")
      .doc(eventId)
      .collection("guests")
      .orderBy("createdAt", "desc")
      .get();

    const guests = snapshot.docs.map(doc => doc.data());

    res.json(guests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch guests" });
  }
});


// ================= GET SINGLE GUEST =================
router.get("/:guestId", authMiddleware, async (req, res) => {
  try {
    const { eventId, guestId } = req.params;

    const doc = await db
      .collection("users")
      .doc(req.user.uid)
      .collection("events")
      .doc(eventId)
      .collection("guests")
      .doc(guestId)
      .get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Guest not found" });
    }

    res.json(doc.data());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch guest" });
  }
});


// ================= UPDATE GUEST =================
router.put("/:guestId", authMiddleware, async (req, res) => {
  try {
    const { eventId, guestId } = req.params;

    const {
      name,
      number,
      gender,
      rsvpStatus,
      foodPreference,
      groups,
      address,
    } = req.body;

    await db
      .collection("users")
      .doc(req.user.uid)
      .collection("events")
      .doc(eventId)
      .collection("guests")
      .doc(guestId)
      .update({
        name,
        number,
        gender,
        rsvpStatus,
        foodPreference,
        groups,
        address: address || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    res.json({ message: "Guest updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update guest" });
  }
});


// ================= DELETE GUEST =================
router.delete("/:guestId", authMiddleware, async (req, res) => {
  try {
    const { eventId, guestId } = req.params;

    await db
      .collection("users")
      .doc(req.user.uid)
      .collection("events")
      .doc(eventId)
      .collection("guests")
      .doc(guestId)
      .delete();

    res.json({ message: "Guest deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete guest" });
  }
});

module.exports = router;
