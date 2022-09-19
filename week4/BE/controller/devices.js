var users = [
  {
    id: 1,
    userName: "john",
    password: "1234",
  },
  {
    id: 2,
    userName: "duc",
    password: "1234",
  },
];

var dataDevice = [
  {
    id: 1,
    name: "TV",
    address: "00:1B:44:11:3A",
    ip: "127.0.0.2",
    createDate: "2021-5-3",
    power: 50,
    userId: 1,
  },
  {
    id: 2,
    name: "Washer",
    address: "02:1A:55:11:3A",
    ip: "127.0.0.2",
    createDate: "2021-5-3",
    power: 100,
    userId: 1,
  },
  {
    id: 3,
    name: "Selling",
    address: "02:1A:55:11:3A",
    ip: "127.0.0.2",
    createDate: "2021-5-3",
    power: 60,
    userId: 1,
  },
  {
    id: 3,
    name: "Selling",
    address: "02:1A:55:11:3A",
    ip: "127.0.0.2",
    createDate: "2021-5-3",
    power: 60,
    userId: 2,
  },
];

const handleLogin = (ctx) => {
  let userName = ctx.request.body.userName;
  let password = ctx.request.body.password;
  if (!userName || !password) {
    ctx.response.status = 500;
    ctx.body = { errCode: 1, message: "bad request" };
  }

  const currUser = users.filter((e) => e.userName == userName);

  if (currUser.length == 1) {
    if (currUser[0].password == password) {
      ctx.response.status = 200;
      ctx.body = { errCode: 0, data: currUser[0] };
    } else {
      ctx.body = {
        errCode: 3,
        message: "Wrong password",
      };
    }
  } else {
    ctx.body = {
      errCode: 2,
      message: "Username isn't exist in your system. plz try other name",
    };
  }
};

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

  console.log(id, name, ip, power);
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
  handleLogin,
};
