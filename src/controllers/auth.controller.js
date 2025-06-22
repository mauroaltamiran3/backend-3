import User from "../dao/models/users.model.js";
import { createToken } from "../helpers/token.helper.js";

const register = async (req, res) => {
  res.redirect("/login?registroExitoso=1");
};

const login = (req, res) => {
  const user = req.user;

  const token = createToken({
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
    last_name: user.last_name,
  });

  res
    .cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    })
    .redirect("/?success=login");
};

const signout = (req, res) => {
  res.clearCookie("token").redirect("/login");
};

const online = (req, res) => res.json200("It's online");

const google = async (req, res, next) => {
  try {
    const profile = req.user;
    const email = profile.email;
    const googleId = profile.googleId;
    const firstName = profile.given_name ?? profile.name?.givenName ?? "";
    const lastName = profile.family_name ?? profile.name?.familyName ?? "";
    const avatarUrl = profile.avatar;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        provider: "google",
        googleId,
        name: firstName,
        last_name: lastName,
        email,
        avatar: avatarUrl,
      });
    }

    const token = createToken({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      last_name: user.last_name,
    });

    res
      .cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect("/");
  } catch (err) {
    next(err);
  }
};

const failure = (req, res) => {
  return res.json401();
};

const setAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).send("❌ Usuario no encontrado");

    user.role = "ADMIN";
    await user.save();

    const token = createToken({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      last_name: user.last_name,
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .redirect("/?rol=admin");
  } catch (error) {
    res.status(500).send("❌ No se pudo cambiar el rol.");
  }
};

const setUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send("❌ Usuario no encontrado");

    user.role = "USER";
    await user.save();

    const token = createToken({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      last_name: user.last_name,
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .redirect("/?rol=user");
  } catch (error) {
    res.status(500).send("❌ No se pudo cambiar el rol.");
  }
};

export { register, login, signout, online, google, failure, setAdmin, setUser };
