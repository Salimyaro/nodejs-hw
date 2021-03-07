import jwt from "jsonwebtoken";
import Users from "../model/users.js";
import { HttpCode } from "../helpers/constants.js";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

const reg = async ({ body }, res, next) => {
  console.log(body);
  try {
    const user = await Users.findByEmail(body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email in use",
      });
    }
    const newUser = await Users.create(body);
    return res.status(HttpCode.CREATED).json({
      status: "user created",
      code: HttpCode.CREATED,
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async ({ body }, res, next) => {
  try {
    const user = await Users.findByEmail(body.email);
    if (!user || !(await user.validPassword(body.password))) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Email or password is wrong",
      });
    }
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(id, token);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async ({ user }, res, next) => {
  try {
    const loginedUser = await Users.findById(user.id);
    if (!loginedUser) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }
    await Users.updateToken(user.id, null);
    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (e) {
    next(e);
  }
};

const current = async ({ user }, res, next) => {
  try {
    console.dir(user)
    const currentUser = await Users.findById(user.id);
    if (!currentUser) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }
    res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      email: currentUser.email,
      subscription: currentUser.subscription,
    });
  } catch (e) {
    next(e);
  }
};

const updateSubscription = async ({ user, body }, res, next) => {
  try {
    await Users.updateUserSubscription(user.id, body.subscription);
    const updatedUser = await Users.findById(user.id);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      user: {
        email: updatedUser.email,
        subscription: updatedUser.subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};

export default { reg, login, logout, current, updateSubscription };
