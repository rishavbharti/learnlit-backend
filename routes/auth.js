import express from 'express';
import { register, login, logout, currentUser } from '../controllers/auth';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/current-user', authenticate, currentUser);

router.post('/logout', logout);

module.exports = router;
