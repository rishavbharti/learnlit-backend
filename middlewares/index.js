import expressJwt from 'express-jwt';
import { User } from '../models/user';

const authenticate = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: true,
  getToken: function fromHeaderOrQuerystring(req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      return req.headers.authorization.split(' ')[1];
    }
    if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;

    // return req.cookies.token
  },
});

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user && user.role.includes('Admin')) {
      req.user = user;
      next();
    } else {
      throw new Error({ error: "Don't have the required access" });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json(error);
  }
};

const isInstructor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).exec();

    if (user && user.role.includes('Instructor')) {
      req.user = user;
      next();
    } else {
      throw new Error({ error: "Don't have the required access" });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json(error);
  }
};

export { authenticate, isAdmin, isInstructor };
