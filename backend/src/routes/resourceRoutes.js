const router = require("express").Router();
const ctrl = require("../controllers/resourceController");
const { authenticate, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");
router.use(authenticate);
router.get("/", ctrl.getAll);
router.post("/", authorize("Supervisor", "Admin", "Dean", "ViceDean", "Registrar", "AdminAssistant"), (req, res, next) => { req.uploadSubDir = "resources"; next(); }, upload.single("file"), ctrl.upload);
router.delete("/:id", authorize("Supervisor", "Admin", "Dean", "ViceDean", "Registrar", "AdminAssistant"), ctrl.remove);
module.exports = router;
