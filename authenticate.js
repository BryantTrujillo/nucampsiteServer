const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const LinkedinTokenStrategy = require('passport-linkedin-token').Strategy;

const config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log('JWT payload', jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = (req, res, next) => {
  // console.log(req.user.admin); <-- for testing
  if (req.user.admin) {
    return next();
  } else {
    const err = new Error('You are not authorized to perform this operation!');
    res.status = 403;
    return next(err);
  }
};

exports.facebookPassport = passport.use(
  new FacebookTokenStrategy(
    {
      clientID: config.facebook.clientId,
      clientSecret: config.facebook.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ facebookId: profile.id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (!err && user) {
          return done(null, user);
        } else {
          user = new User({ username: profile.displayName });
          user.facebookId = profile.id;
          user.firstname = profile.name.givenName;
          user.lastname = profile.name.familyName;
          user.save((err, user) => {
            if (err) {
              return done(err, false);
            } else {
              return done(null, user);
            }
          });
        }
      });
    }
  )
);

exports.googlePassport = passport.use(
  new GoogleTokenStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (!err && user) {
          return done(null, user);
        } else {
          user = new User({ username: profile.name });
          user.googleId = profile.id;
          user.firstname = profile.given_Name;
          user.lastname = profile.family_Name;
          user.save((err, user) => {
            if (err) {
              return done(err, false);
            } else {
              return done(null, user);
            }
          });
        }
      });
    }
  )
);

exports.linkedinPassport = passport.use(
  new LinkedinTokenStrategy(
    {
      consumerKey: config.linkedin.clientId,
      consumerSecret: config.linkedin.clientSecret,
      // redirectUri: config.linkedin.redirectUri,
      scope: ['r_emailaddress', 'r_liteprofile'],
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ linkedinId: profile.id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (!err && user) {
          return done(null, user);
        } else {
          user = new User({ username: r_liteprofile.localizedFirstName });
          user.linkedinId = r_liteprofile.id;
          user.firstname = r_liteprofile.firstname;
          user.lastname = r_liteprofile.lastname;
          user.save((err, user) => {
            if (err) {
              return done(err, false);
            } else {
              return done(null, user);
            }
          });
        }
      });
    }
  )
);
