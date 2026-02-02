const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");
const { getAllUsers, deleteUser } = require("../controllers/admin.controller");

router.get(
  "/users",
  verifyJWT,
  isAdmin,
  getAllUsers
);
router.delete(
  "/users/:id",
  verifyJWT,
  isAdmin,
  deleteUser
);


module.exports = router;
