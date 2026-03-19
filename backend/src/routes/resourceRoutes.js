const router = require("express").Router();
const ctrl = require("../controllers/resourceController");
const { authenticate, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");
router.use(authenticate);
router.get("/", ctrl.getAll);
router.post("/", authorize("Supervisor", "Admin"), (req, res, next) => { req.uploadSubDir = "resources"; next(); }, upload.single("file"), ctrl.upload);
router.delete("/:id", authorize("Supervisor", "Admin"), ctrl.remove);
module.exports = router;
