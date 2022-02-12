import express from 'express';
import {
  currentUser,
  addToCart,
  removeFromCart,
  getCart,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkout,
  getEnrolledCourses,
} from '../controllers/user';
import { authenticate } from '../middlewares';

const router = express.Router();

/**
 * /user/current-user API is called whenever the app is loaded.
 * And it verifies whether the token is valid or not.
 * If it is, the user profile is returned (and isAuthenticated is set to true on the frontend;
 * Or else the token is cleared from the localStorage)
 */
router.get('/user/current-user', authenticate, currentUser);

router.get('/user/cart', authenticate, getCart);
router.post('/user/cart', authenticate, addToCart);
router.delete('/user/cart/:id', authenticate, removeFromCart);
router.post('/checkout', authenticate, checkout);
router.get('/user/enrolled-courses', authenticate, getEnrolledCourses);

router.get('/user/wishlist', authenticate, getWishlist);
router.post('/user/wishlist', authenticate, addToWishlist);
router.delete('/user/wishlist/:id', authenticate, removeFromWishlist);

module.exports = router;
