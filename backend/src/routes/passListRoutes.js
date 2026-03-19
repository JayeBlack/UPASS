const router = require("express").Router();
const ctrl = require("../controllers/passListController");
const { authenticate, authorize } = require("../middleware/auth");
router.use(authenticate);
router.get("/", ctrl.getAll);
router.post("/generate", authorize("ExamsOfficer", "Admin", "Dean"), ctrl.generate);
module.exports = router;
