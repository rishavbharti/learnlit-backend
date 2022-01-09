import express from 'express';
import {
  getCourseCategories,
  getTaughtCourses,
  getPostedCourses,
  getCourse,
  createCourse,
  updateCourse,
} from '../controllers/course';
import { authenticate, isInstructor } from '../middlewares';

const router = express.Router();

router.get('/course-categories', getCourseCategories);
router.get('/me/taught-courses', authenticate, isInstructor, getTaughtCourses);
router.get('/me/posted-courses', authenticate, isInstructor, getPostedCourses);
router.get('/course/:id', getCourse);
router.post('/course', authenticate, isInstructor, createCourse);
router.put('/course/:id', authenticate, isInstructor, updateCourse);

module.exports = router;
