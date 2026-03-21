const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Check if required environment variables are set
if (process.env.NODE_ENV === "production") {
  const requiredEnvVars = [
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
    "FIREBASE_DATABASE_URL",
  ];
  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
  if (missingVars.length > 0) {
    console.error(
      "⚠️  Missing required environment variables:",
      missingVars.join(", "),
    );
    console.warn("Server will start but Firebase operations may fail");
  }
}

const noteRoutes = require("./routes/notes");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow requests from Vercel and localhost
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://notes-webapp-xi.vercel.app",
      "https://notes-webapp-aib48m131-shreyanxhhh17s-projects.vercel.app"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Request timeout middleware (10 seconds)
app.use((req, res, next) => {
  req.setTimeout(10000);
  res.setTimeout(10000);
  next();
});

// Root route
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Notes API Server is running", version: "1.0.0" });
});

// Routes
app.use("/api/notes", noteRoutes);

// 404 handler
app.use("*", (req, res) => {
  console.log("404 - Route not found:", req.method, req.originalUrl);
  res.status(404).json({ 
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    firebase: !!admin.apps.length ? "connected" : "not connected"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
