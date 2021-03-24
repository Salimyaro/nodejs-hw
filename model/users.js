const User = require("./schemas/user");

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findById = async (id) => {
  return await User.findOne({ _id: id });
};
const findByVerificationToken = async (verificationToken) => {
  return await User.findOne({ verificationToken });
};

const create = async ({ email, password, verify, verificationToken }) => {
  const user = new User({ email, password, verify, verificationToken });
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateVerifyToken = async (id, verify, verificationToken) => {
  return await User.findOneAndUpdate(
    { _id: id },
    { verify, verificationToken }
  );
};

const updateUserSubscription = async (id, subscription) => {
  return await User.updateOne({ _id: id }, { subscription });
};

const updateAvatarUrl = async (id, avatar) => {
  return await User.updateOne({ _id: id }, { avatar });
};

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
