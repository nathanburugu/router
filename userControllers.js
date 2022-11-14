/** @format */

const userz = require('../models/user');
const createError = require('http-errors');
const { authSchema } = require('../auths/auth_schema');
require('dotenv').config();
const { signAccessToken } = require('../auths/JWThelper');
const { verifyAccessToken } = require('../auths/JWThelper');
const { signRefreshToken } = require('../auths/JWThelper');

module.exports = {
  register: async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const result = await authSchema.validateAsync(req.body);

      const exists = await userz.findOne({ email: email });
      if (exists)
        throw createError.Conflict(`${email} has already been registered`);

      const user = new userz(result);
      const savedUser = await user.save();
      // res.send({ savedUser });
      const accessToken = await signAccessToken(savedUser.id);
      const refreshToken = await signRefreshToken(savedUser.id);
      res.send({ accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  },
};
