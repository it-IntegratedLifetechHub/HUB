require("dotenv").config();
const express = require("express");
const path = require("path");
const createError = require("http-errors");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const compression = require("compression");

// Initialize Express app
const app = express();

// Validate required environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Error: Missing required environment variable ${envVar}`);
    process.exit(1);
  }
}

// Environment variables with defaults
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const TRUST_PROXY = process.env.TRUST_PROXY || false;

// Enhanced MongoDB connection with retry logic
const connectWithRetry = () => {
  mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      if (NODE_ENV === "production") {
        console.log("⏳ Retrying MongoDB connection in 5 seconds...");
        setTimeout(connectWithRetry, 5000);
      } else {
        process.exit(1);
      }
    });
};

connectWithRetry();

// Trust proxy if behind load balancer/reverse proxy
if (TRUST_PROXY) {
  app.set("trust proxy", TRUST_PROXY === "true" ? true : TRUST_PROXY);
}

// Security Middlewares
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Enhanced security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", FRONTEND_URL],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hsts: {
      maxAge: 63072000, // 2 years in seconds
      includeSubDomains: true,
      preload: true,
    },
  })
);

// Compression middleware
app.use(compression());

// Body parsers with improved security
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Rate limiting with different settings for auth routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === "development" ? 1000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later",
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many login attempts, please try again later",
});

app.use("/api/", apiLimiter);
app.use(["/login", "/register"], authLimiter);

// Enhanced logging with request/response details
app.use(
  morgan(NODE_ENV === "development" ? "dev" : "combined", {
    skip: (req) => req.path === "/health",
  })
);

// Static files with security headers
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: NODE_ENV === "production" ? "1y" : "0",
    setHeaders: (res, path) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      if (path.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-store");
      }
    },
  })
);

// Health check endpoint with DB status
app.get("/health", async (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
    database: dbStatus,
    uptime: process.uptime(),
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

// Enhanced error handler
app.use((err, req, res, next) => {
  // Log the error with additional context
  console.error({
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    status: err.status || 500,
    message: err.message,
    ...(NODE_ENV === "development" && { stack: err.stack }),
  });

  // Determine response format
  res.status(err.status || 500);

  if (req.accepts("json")) {
    res.json({
      status: "error",
      message: err.message,
      ...(NODE_ENV === "development" && { details: err.stack }),
    });
  } else {
    res.type("txt").send(err.message);
  }
});

// Server startup with validation
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
  console.log(
    `🔗 MongoDB: ${MONGODB_URI.split("@")[1]?.split("/")[0] || MONGODB_URI}`
  );
  console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
  console.log(`🛡️ Trust proxy: ${TRUST_PROXY}`);
});

// Enhanced graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  try {
    await new Promise((resolve) => server.close(resolve));
    console.log("HTTP server closed");

    await mongoose.connection.close(false);
    console.log("MongoDB connection closed");

    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Handle unhandled rejections and exceptions
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  shutdown("UNCAUGHT_EXCEPTION");
});

module.exports = app;
