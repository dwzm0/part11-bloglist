/* eslint-disable no-underscore-dangle */
const jwt = require("jsonwebtoken")

const signToken = (user) => jwt.sign(
  {
    username: user.username,
    id: user._id,
  },
  process.env.SECRET,
  { expiresIn: 60 * 60 },
)

module.exports = {
  signToken,
}
