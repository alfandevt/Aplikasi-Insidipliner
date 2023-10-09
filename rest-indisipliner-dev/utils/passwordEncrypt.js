const bcrypt = require("bcrypt");

const encrypt = async (plainText, saltRound = 10) => {
  return await bcrypt.hash(plainText, parseInt(saltRound, 10));
};

const compare = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  encrypt,
  compare,
};
