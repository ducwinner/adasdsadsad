const { dataDevice } = require("../data/devices");

const getDataDevices = (ctx) => {
  var id = ctx.request.body.userId;
  console.log(id);
  if (!id) {
    ctx.response.status = 500;
    ctx.body = { errCode: 1, message: "bad request" };
  }

  const data = dataDevice.filter((e) => e.userId == id);
  ctx.body = { errCode: 0, data: data };
  ctx.response.status = 200;
};

const addDataDevices = (ctx) => {
  let id = ctx.request.body.userId;
  let name = ctx.request.body.name;
  let ip = ctx.request.body.ip;
  let power = ctx.request.body.power;
  let date = ctx.request.body.createDate;

  if (name && ip && power && id) {
    dataDevice.push({
      name: name,
      address: "",
      ip: ip,
      createDate: !date && "",
      power: power,
      userId: id,
    });
    ctx.body = "Device Created!";
    ctx.status = 201;
  } else {
    ctx.response.status = 500; //Set status to 404 as movie was not found
    ctx.body = { message: "Bad request" };
  }
};

module.exports = {
  getDataDevices,
  addDataDevices,
};
