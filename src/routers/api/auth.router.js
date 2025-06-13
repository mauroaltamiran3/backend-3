import CustomRouter from "../../helpers/CustomRouter.helper.js";
import {
  register,
  login,
  signout,
  online,
  google,
  failure,
} from "../../controllers/auth.controller.js";
import passportCb from "../../middlewares/passportCb.mid.js";
import passport from "../../middlewares/passport.mid.js";

class AuthRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }
  init = () => {
    this.create("/register", ["PUBLIC"], passportCb("register"), register);
    this.create("/login", ["PUBLIC"], passportCb("login"), login);
    this.create("/signout", ["USER", "ADMIN"], signout);
    this.create("/online", ["USER", "ADMIN"], online);
    this.read(
      "/google",
      ["PUBLIC"],
      passport.authenticate("google", {
        scope: ["email", "profile"],
        prompt: "select_account", // opcional, fuerza selección de cuenta
      })
    );
    this.read("/google/callback", ["PUBLIC"], passportCb("google"), google);
    this.read("/google/failure", ["PUBLIC"], failure);
  };
}

const authRouter = new AuthRouter();
export default authRouter.getRouter();
