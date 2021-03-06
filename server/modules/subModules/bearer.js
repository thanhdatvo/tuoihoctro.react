const BearerStrategy = require('passport-http-bearer').Strategy;
import serverConfig from '../../configs/server.config';
const Jwt = require('jsonwebtoken');
import User from '../../models/user.model';
const privateKey = serverConfig.key.privateKey;
export default (passport) => {
  passport.use(new BearerStrategy({}, (token, done) => {
    if (token === serverConfig.token.guest) {
      return done(null, 'guest');
    }
    Jwt.verify(token, privateKey, (err, decoded) => {
      if (decoded === undefined) {
        return done(null, false);
      }
      // console.log(decoded.email);
      User.findUserByEmail(decoded.email, (err1, user) => {
        return !user ? done(null, false) : done(null, user);
      });
      return null;
    });
    return null;
  }));
};
