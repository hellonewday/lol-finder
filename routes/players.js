const router = require("express").Router();
const auth = require("../middleware/auth");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { addPlayer, allPlayers, onePlayer } = require("../controllers/players");

cloudinary.config({
  cloud_name: "vn-esports",
  api_key: "996178356223912",
  api_secret: "rC8_6QyIf1DIbokVgSYe0VLsJwQ",
});

const uploads = multer({
  storage: multer.memoryStorage(),
  limits: 10 * 1024 * 1024,
});

// router.get("/");

router.get("/", allPlayers);
router.get("/:id", onePlayer);
router.post("/", uploads.single("picture"), auth, addPlayer);

module.exports = router;
