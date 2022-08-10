const SECRET = process.env.SECRET;
const HASH_STRENGTH = 10;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/// Exports a function that, when called, defines a new User
/// has extra auth stuff like password encryption and jwt signing
const userSchema = (sequelize, DataTypes) => {
  const model = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        /// Token is a virtual datatype, that means it has no value but when
        /// requested it generates something on the spot to give back
        /// in this case, it generates an object with the user's role and name
        /// and then encrypts it so it can work as an authorization method
        /// (because you needed your username and your password to get the token)
        const payload = { username: this.username, role: this.role };
        return jwt.sign(payload, SECRET, { expiresIn: process.env.JWTEXPIRE });
      },
    },
  });

  model.beforeCreate(async (user) => {
    let hashedPassword = await bcrypt.hash(user.password, HASH_STRENGTH);
    user.password = hashedPassword;
    user.role = 'admin';
  });

  return model;
};

module.exports = userSchema;
