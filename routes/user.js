import express from 'express';
import { currentUser } from '../controllers/user';
import { authenticate } from '../middlewares';

const router = express.Router();

router.get('/user/current-user', authenticate, currentUser);

module.exports = router;
