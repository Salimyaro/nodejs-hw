import jwt from "jsonwebtoken";
import Users from "../model/users.js";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import { v4 as uuidv4 } from "uuid";
import checkOrMakeFolder from "../helpers/create-dir.js";
import { HttpCode } from "../helpers/constants.js";
import EmailService from "../services/email.js";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;
const PORT = process.env.PORT

const reg = async ({ body }, res, next) => {
  try {
    const user = await Users.findByEmail(body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email in use",
      });
    }
    const verificationToken = uuidv4();
    const emailService = new EmailService(process.env.NODE_ENV);
    await emailService.sendEmail(verificationToken, body.email);
    const newUser = await Users.create({
      ...body,
      verify: false,
      verificationToken,
    });
    return res.status(HttpCode.CREATED).json({
      status: "user created",
      code: HttpCode.CREATED,
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatar: newUser.avatar,
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async ({ body }, res, next) => {
  try {
    const user = await Users.findByEmail(body.email);
    const isValidPassword = await user?.validPassword(body.password);
    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Email or password is wrong",
      });
    }
    if (!user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Email not verified",
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
          avatar: user.avatar,
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
      avatar: currentUser.avatar,
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

const avatars = async (req, res, next) => {
  try {
    const avatarUrl = await saveAvatarToStatic(req);
    await Users.updateAvatarUrl(req.user.id, avatarUrl);
    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: {
        avatarUrl,
      },
    });
  } catch (e) {
    next(e);
  }
};

const saveAvatarToStatic = async ({ user, file }) => {
  const USERS_AVATARS_DIR = process.env.USERS_AVATARS_DIR;
  const newAvatarName = `${Date.now()}-${file.originalname}`;
  const img = await Jimp.read(file.path);
  img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(file.path);

  await checkOrMakeFolder(path.join(USERS_AVATARS_DIR, user.id));
  await fs.rename(
    file.path,
    path.join(USERS_AVATARS_DIR, user.id, newAvatarName)
  );
  const avatarUrl = path.normalize(
    path.join(`http://localhost:${PORT}/images`, user.id, newAvatarName)
  );
  
  return avatarUrl;
};

const verifyToken = async (req, res, next) => {
  try {
    const user = await Users.findByVerificationToken(
      req.params.verificationToken
    );
    if (user) {
      await Users.updateVerifyToken(user.id, true, null);
      return res.json({
        status: "success",
        code: HttpCode.OK,
        message: "Verification successful!",
      });
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: "User not found",
    });
  } catch (e) {
    next(e);
  }
};


export default { reg, login, logout, current, updateSubscription, avatars, verifyToken };
