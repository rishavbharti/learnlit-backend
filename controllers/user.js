import { User } from '../models/user';

const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').exec();

    if (user) {
      return res.json(user);
    }

    return res.status(404).send('User not found.');
  } catch (error) {
    res.status(401).json(error);
  }
};

export { currentUser };
