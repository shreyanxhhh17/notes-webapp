const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!privateKey) {
  throw new Error("FIREBASE_PRIVATE_KEY is missing from environment variables");
}

const formattedKey = privateKey.includes("\\n")
  ? privateKey.replace(/\\n/g, "\n")
  : privateKey;

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: formattedKey,
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    console.log("✅ Firebase initialized successfully");
  } catch (error) {
    console.error("❌ Firebase initialization error:", error.message);
  }
}

const db = admin.firestore();

module.exports = { db, admin };
