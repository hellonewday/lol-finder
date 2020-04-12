const router = require("express").Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const controllers = require("../controllers/teams");

const uploads = multer({
  storage: multer.memoryStorage(),
  limits: 10 * 1024 * 1024,
});

router.get("/", controllers.allTeams);
router.get("/:id", controllers.oneTeam);
router.post("/", auth, uploads.single("logo"), controllers.addTeam);
router.patch("/:id", auth, uploads.single("logo"), controllers.updateTeam);
router.delete("/:id", auth, controllers.removeTeam);
// router.get("/test", auth, controllers.testAPI);

module.exports = router;
