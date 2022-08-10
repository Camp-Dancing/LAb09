const { userModel } = require('../../Models/db');

const bcrypt = require('bcrypt');

/// endpoint, takes a sent request body and turns it into a new User model, aka a new account
/// for someone to use with our API!
async function signupUser(req, res) {
  try {
    let obj = req.body;
    const doesNameExists = await userModel.findOne({
      where: { username: req.body.username },
    });
    if (!doesNameExists) {
      let newUsers = await userModel.create(obj);
      res.status(200).json(newUsers);
    } else {
      res.status(500).send(`User ${req.body.username} already exists.`);
    }
  } catch (e) {
    console.log(e);
  }
}

/// endpoint, takes a username and password in the req body
/// if the password is correct, returns your token in an object.
/// your token is what you use to bearer authorize other actions
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
  res.status(403).send('Invalid username/password.');
}

module.exports = {
  signinUser,
  signupUser,
};
