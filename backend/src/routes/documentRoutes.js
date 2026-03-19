const router = require("express").Router();
const ctrl = require("../controllers/documentController");
const { authenticate, authorize } = require("../middleware/auth");
router.use(authenticate);
router.get("/student/:studentId", ctrl.getByStudent);
router.post("/", ctrl.create);
router.put("/:id/status", authorize("Admin", "Dean"), ctrl.updateStatus);
module.exports = router;
