const Router = require("koa-router");
const router = new Router();
const {
  getDataDevices,
  addDataDevices,
  handleLogin,
} = require("./controller/devices");

router.post("/api/login", handleLogin);
router.post("/api/getAll", getDataDevices);
router.post("/api/add-device", addDataDevices);

module.exports = router;
