import jwt from 'jsonwebtoken';

import { User } from '../models/user';

import { comparePassword, hashPassword } from '../utils';

import { interests } from '../data/interests';

const register = async (req, res) => {
  try {
    return res.status(503).send({ errorMessage: "Sign-up is disabled temporarily!" });
    
    const { name, email, password } = req.body;

    if (!name)
      return res.status(400).send({ errorMessage: 'Name is required.' });

    if (!email)
      return res.status(400).send({ errorMessage: 'Email is required.' });

    if (!password || password.length < 6) {
      return res.status(400).send({
        errorMessage:
          'Password is required and must be at least 6 characters long.',
      });
    }

    const userExists = await User.findOne({ email }).exec();

    if (userExists) {
      return res.status(400).send({
        errorMessage:
          'This email address is already associated with another account. Try with another email.',
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({ name, email, password: hashedPassword, interests });

    await user.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    user.password = undefined;

    res.cookie('token', token, {
      httpOnly: true,
      // domain: '',
      secure: process.env.NODE_ENV !== 'development', // Only works on https
    });

    return res.json({ ...user.toObject({ getters: true }), token });
  } catch (error) {
    return res.status(400).send({ errorMessage: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send('Please enter a valid email address.');
    }

    const user = await User.findOne({ email }).lean().exec();

    if (user) {
      const isPasswordValid = await comparePassword(password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );

        user.password = undefined;
        user.token = token;

        res.cookie('token', token, {
          httpOnly: true,
          // domain: '',
          secure: process.env.NODE_ENV !== 'development', // Only works on https
        });

        return res.json(user);
      }
    }

    return res.status(404).send({
      errorMessage:
        "Sorry, we don't recognize that username or password. You can try again or reset your password",
    });
  } catch (error) {
    return res.status(400).json({
      errorMessage: error.message,
    });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie('token');
    return res.json('Successfully logged out.');
  } catch (error) {
    console.log(error);
  }
};

export { register, login, logout };
