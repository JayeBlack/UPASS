const router = require("express").Router();
const ctrl = require("../controllers/examController");
const { authenticate, authorize } = require("../middleware/auth");
router.use(authenticate);
router.get("/timetable", ctrl.getTimetable);
router.post("/timetable", authorize("ExamsOfficer", "Admin", "Dean", "ViceDean"), ctrl.createEntry);
module.exports = router;
