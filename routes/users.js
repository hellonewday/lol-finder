const router = require("express").Router();
const {
  allUsers,
  registerUser,
  deleteUser,
  loginUser,
  oneUser,
} = require("../controllers/users");

const auth = require("../middleware/auth");

router.get("/", allUsers);
router.get("/:id", oneUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/:id", auth, deleteUser);

module.exports = router;
