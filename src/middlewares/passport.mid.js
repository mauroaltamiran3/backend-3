import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { usersManager } from "../dao/mongo.manager.js";
import { compareHash, createHash } from "../helpers/hash.helper.js";
import { createToken } from "../helpers/token.helper.js";
import logger from "../helpers/logger.helper.js";

// Registro local
passport.use(
  "register",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      try {
        const existing = await usersManager.readOne({ email });
        if (existing) {
          return done(null, null, {
            message: "Invalid credentials",
            statusCode: 401,
          });
        }
        req.body.password = createHash(password);
        const user = await usersManager.createOne(req.body);
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Login local
passport.use(
  "login",
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: "email",
      passwordField: "password",
    },
    async (req, email, password, done) => {
      try {
        const user = await usersManager.readOne({ email });
        if (!user || !compareHash(password, user.password)) {
          return done(null, null, {
            message: "Invalid credentials",
            statusCode: 401,
          });
        }
        const token = createToken({
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          last_name: user.last_name,
        });
        req.token = token;
        done(null, user, { token });
      } catch (error) {
        done(error);
      }
    }
  )
);

// Google OAuth2
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:8090/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        logger.INFO("→ Google profile:", JSON.stringify(profile, null, 2));

        let email = "";
        if (Array.isArray(profile.emails) && profile.emails.length) {
          email = profile.emails[0].value;
        } else if (profile._json?.email) {
          email = profile._json.email;
        }

        let avatarUrl = "";
        if (Array.isArray(profile.photos) && profile.photos.length) {
          avatarUrl = profile.photos[0].value;
        } else if (profile._json?.picture) {
          avatarUrl = profile._json.picture;
        }

        if (!email) {
          return done(null, null, {
            message: "No email received from Google",
            statusCode: 400,
          });
        }

        const googleId = profile.id;
        const firstName = profile.name?.givenName || "";
        const lastName = profile.name?.familyName || "";

        let user = await usersManager.readOne({ email });
        if (!user) {
          user = await usersManager.createOne({
            provider: "google",
            googleId,
            name: firstName,
            last_name: lastName,
            email,
            avatar: avatarUrl,
            password: createHash(googleId),
          });
        }

        const token = createToken({
          email: user.email,
          role: user.role,
          user_id: user._id,
        });

        req.token = token;
        done(null, user, { token });
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "jwt-auth",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY,
    },
    async (data, done) => {
      try {
        const { user_id } = data;
        const user = await usersManager.findById(user_id);
        if (!user) {
          return done();
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "jwt-adm",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
      secretOrKey: process.env.JWT_KEY,
    },
    async (payload, done) => {
      try {
        const { user_id, role } = payload;
        const user = await usersManager.readById(user_id);
        if (!user || role !== "ADMIN") {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

export default passport;
