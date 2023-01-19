const Users = require("../../models/user");
const bcrypt = require("bcryptjs");

module.exports.apiGetUsers = async function (req, res) {
  const { limit = 20, skip = 0 } = req?.query || {};
  const whereCondition = {};
  const [users, total] = await Promise.all([
    Users.find(whereCondition).sort({ _id: -1 }).skip(Number(skip)).limit(Number(limit)).exec(),
    Users.find(whereCondition).count(),
  ]);

  res.send({
    data: users,
    total,
  });
}

module.exports.apiUpdateUser = async function (req, res) {
  const userId = req?.params?.userId || '';
  const existUser = await Users.findOne({ _id: userId }).exec();

  if (!existUser) {
    res.status(404);
    res.send('Not found any user');
    return;
  }
  const body = req?.body || {};
  const { password } = body;
  const udpatedUser = { ...body };

  if (password) {
    udpatedUser.password = bcrypt.hashSync(password, 10);
  }
  await Users.updateOne({
    _id: userId,
  }, udpatedUser).exec();

  res.send({
    message: 'Update user successfully'
  });
}

module.exports.apiCreateUser = async function (req, res) {
  const body = req?.body || {};
  const { username, email, password } = body;
  let newPassword = password;

  if (!username) {
    res.status(400);
    res.send('Username is required');
    return;
  }
  if (!email) {
    res.status(400);
    res.send('Email is required');
  }
  if (password) {
    newPassword = bcrypt.hashSync(password, 10)
  }
  const newUser = await Users.create({
    ...body,
    password: newPassword,
  })

  res.send(newUser);
}

module.exports.apiDeleteUser = async function (req, res) {
  const userId = req?.params?.userId || '';

  await Users.deleteOne({
    _id: userId,
  }).exec();

  res.send({
    message: 'Delete user successfully',
  });
}
