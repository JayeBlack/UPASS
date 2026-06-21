const router = require("express").Router();
const ctrl = require("../controllers/courseController");
const { authenticate, authorize } = require("../middleware/auth");
router.use(authenticate);
router.get("/", ctrl.getAll);
router.get("/all-registrations", authorize("Admin", "Dean", "ViceDean", "Registrar", "AdminAssistant", "ExamsOfficer"), ctrl.getAllRegistrations);
router.get("/registered/:studentId", ctrl.getRegistered);
router.get("/student/:studentId", ctrl.getRegistered); // Alias for dashboard
router.post("/register", ctrl.register);
router.delete("/register/:id", ctrl.dropCourse);
module.exports = router;
