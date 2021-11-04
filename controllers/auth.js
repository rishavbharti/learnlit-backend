import jwt from 'jsonwebtoken';

import { User } from '../models/user';

import { hashPassword } from '../utils';

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) return res.status(400).send('Name is required.');

    if (!email) return res.status(400).send('Email is required.');

    if (!password || password.length < 6) {
      return res
        .status(400)
        .send('Password is required and must be at least 6 characters long.');
    }

    const userExists = await User.findOne({ email }).exec();

    if (userExists) {
      return res
        .status(400)
        .send('This email address is already associated with another account.');
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({ name, email, password: hashedPassword });

    await user.save();

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(400).send('Error. Try again');
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send('Please enter a valid email address.');
    }

    const user = await User.findOne({ email }).exec();

    if (user) {
      const isPasswordValid = await user.comparePassword(password);

      if (isPasswordValid) {
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
          // secure: true, // Only works on https
        });

        return res.json(user);
      }
      return res.status(404).send('Please enter a valid password.');
    }
    return res
      .status(404)
      .send(
        "Couldn't find an account associated with this email address. Please enter a registerd email address."
      );
  } catch (error) {
    return res.status(400).send('Error. Try again');
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
