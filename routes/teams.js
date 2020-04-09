const router = require("express").Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const controllers = require("../controllers/teams");

const uploads = multer({
  storage: multer.memoryStorage(),
  limits: 10 * 1024 * 1024,
});

router.get("/", controllers.allTeams);

module.exports = router;
