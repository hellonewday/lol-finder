const router = require("express").Router();
const auth = require("../middleware/auth");
// const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const {
  addPlayer,
  allPlayers,
  onePlayer,
  removePlayer,
} = require("../controllers/players");

const uploads = multer({
  storage: multer.memoryStorage(),
  limits: 10 * 1024 * 1024,
});

// router.get("/");

router.get("/", allPlayers);

router.get("/:id", onePlayer);

router.post("/", uploads.single("picture"), auth, addPlayer);

router.delete("/", auth, removePlayer);

module.exports = router;
