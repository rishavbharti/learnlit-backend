import express from 'express';
import {
  getCourseCategories,
  getTaughtCourses,
  createCourse,
  updateCourse,
} from '../controllers/course';
import { authenticate, isInstructor } from '../middlewares';

const router = express.Router();

router.get('/course-categories', getCourseCategories);
router.get('/me/taught-courses', authenticate, isInstructor, getTaughtCourses);
router.post('/course', authenticate, isInstructor, createCourse);
router.put('/course/:id', authenticate, isInstructor, updateCourse);

module.exports = router;
