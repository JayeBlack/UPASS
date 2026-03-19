const router = require("express").Router();
const ctrl = require("../controllers/supervisorController");
const { authenticate } = require("../middleware/auth");
router.use(authenticate);
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.get("/:id/students", ctrl.getAssignedStudents);
router.post("/:id/assign", ctrl.assignStudent);
module.exports = router;
