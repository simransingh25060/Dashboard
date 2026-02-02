const express = require("express");
const router = express.Router();

const { signup, login, updateProfile, getProfile } = require("../controllers/auth.controller");
// const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/multer.middleware");
const { verifyJWT } = require("../middleware/auth.middleware");

router.post("/signup", signup);
router.post("/login", login);
// router.use(verifyJWT)
router.put("/upload",
    upload.single("image"), 
    verifyJWT, 
    updateProfile);

router.get("/me", verifyJWT, 
    getProfile
)

module.exports = router;
