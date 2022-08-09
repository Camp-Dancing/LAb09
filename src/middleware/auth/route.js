const { userModel } = require('../../server');

const bcrypt = require('bcrypt');

async function signupUser(req, res) {
  try {
    let obj = req.body;
    const doesNameExists = await userModel.findOne({
      where: { username: req.body.username },
    });
    if (doesNameExists === null) {
      let newUsers = await userModel.create(obj);
      res.status(200).json(newUsers);
    } else {
      res.status(500).send(`cannot create user ${req.body.username}`);
    }
  } catch (e) {
    console.log(e);
  }
}

async function signinUser(req, res) {
  try {
    const user = await userModel.findOne({
      where: { username: req.body.username },
    });

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (isValid) {
      res.status(200).send({ user: user.username, token: user.token });
      return;
    }
  } catch (e) {
    res.status(500);
  }
  res
    .status(403)
    .send(
      'Invalid username/pasword. Too bad we don\'t have an account recovery mechanism'
    );
  // }
  // router.post('/signup', signupUser);
  // router.post('/signin', signinUser);
}

module.exports = {
  signinUser,
  signupUser,
};
