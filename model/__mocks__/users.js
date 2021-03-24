const { users } = require("./data");
const bcrypt = require("bcryptjs");

const findByEmail = jest.fn((email) => {
  const [user] = users.filter((el) => String(el.email) === String(email));
  return user;
});

const findById = jest.fn((id) => {
  const [user] = users.filter((el) => String(el._id) === String(id));
  return user;
});

const findByVerificationToken = jest.fn((verificationToken) => {
  const [user] = users.filter(
    (el) => String(el.verificationToken) === String(verificationToken)
  );
  return user;
});

const create = jest.fn(({ email, password, subscription = "free" }) => {
  const pass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  const newUser = {
    subscription,
    email,
    password: pass,
    verify: true,
    verificationToken: null,
    _id: "605626e63ebd204bf463f972",
    validPassword: function (pass) {
      return bcrypt.compareSync(pass, this.password);
    },
  };
  users.push(newUser);
  return newUser;
});

const updateToken = jest.fn((id, token) => {
  return {};
});

const updateVerifyToken = jest.fn((id, verify, verificationToken) => {
  return {};
});

const updateUserSubscription = jest.fn((id, subscription) => {
  return {};
});

const updateAvatarUrl = jest.fn((id, avatar) => {
  return {};
});

module.exports = {
  findByEmail,
  findById,
  findByVerificationToken,
  create,
  updateToken,
  updateVerifyToken,
  updateUserSubscription,
  updateAvatarUrl,
};
