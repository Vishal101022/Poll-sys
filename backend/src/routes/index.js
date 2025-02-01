const express = require("express");
const pollRoutes = require("./poll.route.js");
const commentRoutes = require("./app/comment.route.js");
const creatorRoutes = require("./app/creator/index.route.js");
const usersRoutes = require("./app/user/index.route.js");
const adminRoutes = require("./admin/index.route.js");
const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get("/health-check", (req, res) => {
  res.send("OK");
});

router.get("/contributors", (req, res) => {
  const contributors = require("../../utils/others/contributors.js");

  return res.status(200).json({
    status: 200,
    message: "Successfully retrieved",
    data: contributors,
  });
});

/** /polls - for polls related routes */
// router.use("/polls", requireAccessToken, pollRoutes);
router.use("/polls", pollRoutes);

/** /comments - for comments related routes */
router.use("/comments", commentRoutes);

/** /users - for users related routes */
router.use("/users", usersRoutes);

/** /creators - for creators related routes */
router.use("/creators", creatorRoutes);

/** /admin - for admin related routes */
router.use("/admin", adminRoutes);

module.exports = router;
