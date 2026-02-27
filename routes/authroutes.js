const express = require("express");
const { admin, db } = require("../config/firebase");

const router = express.Router();

router.post("/firebase", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    const userRef = db.collection("users").doc(decoded.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        uid: decoded.uid,
        phone: decoded.phone_number || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        role: "user",
      });
    }

    res.json({
      message: "User synced successfully",
      uid: decoded.uid,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Authentication failed" });
  }
});

module.exports = router;
