const Router = require("koa-router");
const router = new Router();
const { getProductByTags } = require("../controllers/productController");


router.post("/api/getProductsByTags", getProductByTags);

module.exports = router;
