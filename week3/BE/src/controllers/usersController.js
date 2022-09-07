const { users } = require("../data/users");

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

module.exports = {
  handleLogin,
};
