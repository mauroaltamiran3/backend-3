const register = async (req, res) => {
  const user = req.user;
  res.json201(user);
};
const login = async (req, res) => {
  const { token, user } = req;
  const opts = { maxAge: 60 * 60 * 24 * 7 * 1000 };
  res.cookie("token", token, opts).json200("Logged in");
};

const signout = (req, res) => res.clearCookie("token").json200("Signed out");

const online = (req, res) => res.json200("It's online");

const google = async (req, res) => {
  const { token, user } = req;
  const opts = { maxAge: 60 * 60 * 24 * 7 * 1000 };
  res.cookie("token", token, opts).json200("Logged in with google");
};

const failure = (req, res) => {
  return res.json401();
};

export { register, login, signout, online, google, failure };
