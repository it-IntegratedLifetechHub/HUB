require("dotenv").config();
const express = require("express");
const path = require("path");
const createError = require("http-errors");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

// Initialize Express app
const app = express();

// Validate required environment variables
const requiredEnvVars = ["MONGODB_URI"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: Missing required environment variable ${envVar}`);
    process.exit(1);
  }
}

// Environment variables with defaults
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Database connection with modern options
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Security Middlewares
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Body parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Static files with cache control
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: NODE_ENV === "production" ? "1y" : "0",
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      if (path.endsWith(".html")) {
        // Prevent caching of HTML files in production
        res.setHeader("Cache-Control", "no-store");
      }
    },
  })
);
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === "development" ? 1000 : 100, // Higher limit for development
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// Logging
app.use(morgan(NODE_ENV === "development" ? "dev" : "combined"));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Routes
const routes = require("./routes");
app.use("/", routes);

// 404 Handler
app.use((req, res, next) => {
  next(createError(404, "Endpoint not found"));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals
  res.locals.message = err.message;
  res.locals.error = NODE_ENV === "development" ? err : {};
  res.locals.NODE_ENV = NODE_ENV; // Explicitly pass NODE_ENV to views

  // Log the error
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  if (err.stack && NODE_ENV === "development") {
    console.error(err.stack);
  }

  // Determine response format
  res.status(err.status || 500);

  if (req.accepts("html")) {
    res.render("error", {
      message: err.message,
      error: err,
      NODE_ENV: NODE_ENV,
    });
  } else {
    res.json({
      status: "error",
      message: err.message,
      ...(NODE_ENV === "development" && { stack: err.stack }),
    });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
  console.log(
    `🔗 MongoDB: ${MONGODB_URI.split("@")[1]?.split("/")[0] || MONGODB_URI}`
  );
  console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
});

// Handle graceful shutdown
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

module.exports = app;
