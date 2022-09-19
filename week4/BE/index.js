const Koa = require("koa");
const parser = require("koa-bodyparser");
const cors = require("@koa/cors");
const router = require("./src/router/router");
const App = new Koa();
const port = 8888;

App.use(parser()).use(cors()).use(router.routes());

App.listen(port, () => {
  console.log(`🚀 Server listening http://127.0.0.1:${port}/ 🚀`);
});
