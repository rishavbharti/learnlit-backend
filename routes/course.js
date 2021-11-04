import express from 'express';
import { createCourse, updateCourse } from '../controllers/course';
import { authenticate, isInstructor } from '../middlewares';

const router = express.Router();

router.post('/course', authenticate, isInstructor, createCourse);
router.put('/course/:id', authenticate, isInstructor, updateCourse);

module.exports = router;
