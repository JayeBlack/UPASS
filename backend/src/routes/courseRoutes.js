const router = require("express").Router();
const ctrl = require("../controllers/courseController");
const { authenticate } = require("../middleware/auth");
router.use(authenticate);
router.get("/", ctrl.getAll);
router.get("/registered/:studentId", ctrl.getRegistered);
router.post("/register", ctrl.register);
router.delete("/register/:id", ctrl.dropCourse);
module.exports = router;
