const router = require("express").Router();
const ctrl = require("../controllers/analyticsController");
const { authenticate, authorize } = require("../middleware/auth");
router.use(authenticate);
router.use(authorize("Admin", "Dean", "Accountant", "ExamsOfficer"));
router.get("/overview", ctrl.getOverview);
router.get("/cwa", ctrl.getCWAAnalytics);
router.get("/fees", ctrl.getFeeAnalytics);
module.exports = router;
