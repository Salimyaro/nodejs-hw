import User from "./schemas/user.js";

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findById = async (id) => {
  return await User.findOne({ _id: id });
};

const create = async ({ email, password }) => {
  const user = new User({ email, password });
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateUserSubscription = async (id, subscription) => {
  return await User.updateOne({ _id: id }, { subscription });
};

const updateAvatarUrl = async (id, avatar) => {
  return await User.updateOne({ _id: id }, { avatar });
};

export default {
  findByEmail,
  findById,
  create,
  updateToken,
  updateUserSubscription,
  updateAvatarUrl,
};
