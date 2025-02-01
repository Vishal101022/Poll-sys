const express = require("express");
const authRoutes = require("./auth.route.js");
const passport = require("passport");

const router = express.Router(); // eslint-disable-line new-cap


/** GET /auth - auth service */
router.use("/auth", authRoutes);

// /dashboard - for dashboard related routes
router.use(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  require("./dashboard.route.js")
);

router.use(
  "/access-tokens",
  passport.authenticate("jwt", { session: false }),
  require("./access_token.route.js")
);

router.use(
  "/polls",
  passport.authenticate("jwt", { session: false }),
  require("./polls.route.js")
);

router.use(
  "/creators",
  passport.authenticate("jwt", { session: false }),
  require("./creators.route.js")
);

module.exports = router;
