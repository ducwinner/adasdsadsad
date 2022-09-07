const Router = require("koa-router");
const router = new Router();
const {
  getDataDevices,
  addDataDevices,
} = require("../controllers/devicesController");
const { handleLogin } = require("../controllers/usersController");
const { getActionLogs } = require("../controllers/logsController");

router.post("/api/login", handleLogin);
router.post("/api/getAll", getDataDevices);
router.post("/api/add-device", addDataDevices);
router.post("/api/get-logs", getActionLogs);

module.exports = router;
