require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const createError = require("http-errors");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const compression = require("compression");

// Initialize app
const app = express();

// Validate required environment variables
["MONGODB_URI", "JWT_SECRET"].forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
});

// Environment configs
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const TRUST_PROXY = process.env.TRUST_PROXY === "true";

// MongoDB connection with retry
const connectWithRetry = () => {
  mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
    })
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => {
      console.error("❌ MongoDB error:", err.message);
      if (NODE_ENV === "production") {
        console.log("⏳ Retrying in 5 seconds...");
        setTimeout(connectWithRetry, 5000);
      } else {
        process.exit(1);
      }
    });
};
connectWithRetry();

// Proxy trust
if (TRUST_PROXY) app.set("trust proxy", true);

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
        connectSrc: ["'self'", FRONTEND_URL],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hsts: {
      maxAge: 63072000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Logging
app.use(
  morgan(NODE_ENV === "development" ? "dev" : "combined", {
    skip: (req) => req.path === "/health",
  })
);

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: NODE_ENV === "development" ? 1000 : 100,
  message: "Too many requests. Please try again later.",
});
app.use("/api/", generalLimiter);

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Please try again later.",
});
app.use(["/login", "/register"], authLimiter);

// Serve static assets
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: NODE_ENV === "production" ? "1y" : "0",
    setHeaders: (res, filePath) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-store");
      }
    },
  })
);

// Health check route
app.get("/health", (req, res) => {
  const dbState =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "ok",
    message: "Server healthy",
    database: dbState,
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

// Error Handler
app.use((err, req, res, next) => {
  const errorInfo = {
    time: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    status: err.status || 500,
    message: err.message,
    ...(NODE_ENV === "development" && { stack: err.stack }),
  };

  console.error("❌", errorInfo);

  res.status(errorInfo.status).json({
    status: "error",
    message: errorInfo.message,
    ...(NODE_ENV === "development" && { details: errorInfo.stack }),
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(
    `🔗 MongoDB: ${MONGODB_URI.split("@")[1]?.split("/")[0] || MONGODB_URI}`
  );
  console.log(`🌐 Frontend: ${FRONTEND_URL}`);
  console.log(`🛡️ Trust proxy: ${TRUST_PROXY}`);
});

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n📴 ${signal} received. Shutting down...`);
  try {
    await new Promise((res) => server.close(res));
    await mongoose.connection.close(false);
    console.log("✅ Cleanup complete. Exiting.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Shutdown error:", err);
    process.exit(1);
  }
};

["SIGTERM", "SIGINT"].forEach((signal) =>
  process.on(signal, () => shutdown(signal))
);

// Handle unhandled errors
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  shutdown("UNCAUGHT_EXCEPTION");
});

module.exports = app;
