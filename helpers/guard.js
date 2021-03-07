import passport from "passport";
import "../config/passport.js";
import { HttpCode } from "./constants.js";

const guard = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!user || err || token !== user.token) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

export default guard;
