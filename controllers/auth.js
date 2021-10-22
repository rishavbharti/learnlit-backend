import { User } from '../models/user';

import { hashPassword } from '../utils/auth';

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) return res.status(400).send('Name is required.');

    if (!email) return res.status(400).send('Email is required.');

    if (!password || password.length < 6)
      return res
        .status(400)
        .send('Password is required and must be at least 6 characters long.');

    let userExists = await User.findOne({ email }).exec();

    if (userExists)
      return res
        .status(400)
        .send('This email address is already associated with another account.');

    const hashedPassword = await hashPassword(password);

    const user = new User({ name, email, password: hashedPassword });

    await user.save();

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(400).send('Error. Try again');
  }
};

export { register };
