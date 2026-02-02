const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");
const { getAllUsers } = require("../controllers/admin.controller");

router.get(
  "/users",
  verifyJWT,
  isAdmin,
  getAllUsers
);

module.exports = router;
