import express from 'express';
import { currentUser } from '../controllers/user';
import { authenticate } from '../middlewares';

const router = express.Router();

/**
 * This API is called whenever the app is loaded.
 * And it verifies whether the token is valid or not.
 * If it is, the user profile is returned (and isAuthenticated is set to true on the frontend;
 * Or else the token is cleared from the localStorage)
 */
router.get('/user/current-user', authenticate, currentUser);

module.exports = router;
