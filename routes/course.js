import express from 'express';
import { createCourse } from '../controllers/course';
import { authenticate, isInstructor } from '../middlewares';

const router = express.Router();

router.post('/course', authenticate, isInstructor, createCourse);

module.exports = router;
