import passport from "./passport.mid.js";

function passportCb(strategy) {
  return function (req, res, next) {
    return passport.authenticate(
      strategy,
      { session: false },
      (err, user, info) => {
        if (err) return next(err);

        if (!user) {
          if (strategy === "register") {
            return res.redirect(
              "/register?error=" +
                encodeURIComponent(info?.message || "registro")
            );
          }
          return res.redirect(
            "/login?error=" +
              encodeURIComponent(info?.message || "Credenciales inválidas")
          );
        }

        req.user = user;
        if (info?.token) req.token = info.token;

        next();
      }
    )(req, res, next);
  };
}

export default passportCb;
