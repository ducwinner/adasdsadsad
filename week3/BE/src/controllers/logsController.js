const { logs } = require("../data/logs");

const getActionLogs = async (ctx) => {
  var id = ctx.request.body.userId;
  console.log("id", id);
  if (!id) {
    ctx.response.status = 500;
    ctx.body = { errCode: 1, message: "bad request" };
    return;
  }

  const data = logs.filter((e) => e.userId == id);

  ctx.body = { errCode: 0, data: data };
  ctx.response.status = 200;
};

module.exports = {
  getActionLogs,
};
