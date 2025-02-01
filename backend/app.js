const express = require("express");
const morgan = require("morgan");
const errorHandler = require("./src/middlewares/error_handler.js");
const routes = require("./src/routes/index.js");
const env = require("./config/env.js");
const port = env.PORT;
const helmet = require("helmet");
const hpp = require("hpp");
const limiter = require("./config/rate_limiter.js");
const logger = require("./config/logger.js");
const session = require("express-session");
const cors = require("cors");
const passport = require('./config/passport.js');
const setSecurityHeaders = require("./src/middleware/security-headers.js");

// Create the Express app
const app = express();

// Middleware for logging
app.use((req, res, next) => {
  logger.info(`${req.ip} - ${req.method} ${req.originalUrl} - Query: ${JSON.stringify(req.query)}`);
  next();
});

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5000", "https://ipv4.jsonip.com/"],
  credentials: true,
  method: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// CORS middleware
app.use(cors(corsOptions));

// Security headers middleware
app.use(setSecurityHeaders);

// Session middleware
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(helmet());
app.use(hpp());

// app.use(limiter);

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1", routes);

// Error handling middleware
app.use(errorHandler);


module.exports = app;
