const admin = require("firebase-admin");
const serviceAccount = require("./serviceaccountkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db };
