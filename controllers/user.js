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

// @desc    Add to cart
// @route   POST /api/user/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!_id) {
      return res.status(400).send('Missing user id');
    }

    const data = await User.findByIdAndUpdate(
      _id,
      {
        $addToSet: {
          cart: req.body.id,
        },
      },
      {
        new: true,
        strict: false,
      }
    ).select('cart');

    return res.status(200).send(data.cart);
  } catch (error) {
    res.status(401).json(error);
  }
};

// @desc    Delete from cart
// @route   DELETE /api/user/cart
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!_id) {
      return res.status(400).send('Missing user id');
    }

    await User.findByIdAndUpdate(_id, {
      $pull: { cart: req.params.id },
    }).lean();

    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(401).json(error);
  }
};

// @desc    Fetch cart
// @route   GET /api/user/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!_id) {
      return res.status(400).send('Missing user id');
    }

    const data = await User.findById(_id)
      .lean()
      .populate({
        path: 'cart',
        select: 'title instructors level pricing currency price duration slug',
        populate: {
          path: 'instructors',
          select: 'name',
        },
      })
      .select('cart');

    return res.status(200).send(data.cart);
  } catch (error) {
    res.status(401).json(error);
  }
};

// @desc    Add to wishlist
// @route   POST /api/user/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!_id) {
      return res.status(400).send('Missing user id');
    }

    const data = await User.findByIdAndUpdate(
      _id,
      {
        $addToSet: {
          wishlist: req.body.id,
        },
      },
      {
        new: true,
        strict: false,
      }
    ).select('wishlist');

    return res.status(200).json(data.wishlist);
  } catch (error) {
    res.status(401).json(error);
  }
};

// @desc    Delete from wishlist
// @route   DELETE /api/user/wishlist
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!_id) {
      return res.status(400).send('Missing user id');
    }

    await User.findByIdAndUpdate(_id, {
      $pull: { wishlist: req.params.id },
    }).lean();

    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(401).json(error);
  }
};

// @desc    Fetch wishlist
// @route   GET /api/user/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!_id) {
      return res.status(400).send('Missing user id');
    }

    const data = await User.findById(_id)
      .lean()
      .populate({
        path: 'wishlist',
        populate: {
          path: 'instructors',
          select: 'name',
        },
      })
      .select('wishlist');

    return res.status(200).send(data.wishlist);
  } catch (error) {
    res.status(401).json(error);
  }
};

export {
  currentUser,
  addToCart,
  removeFromCart,
  getCart,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
