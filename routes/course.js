import express from 'express';
import {
  getCourseCategories,
  getAllPublishedCourses,
  getTaughtCourses,
  getPostedCourses,
  getCourse,
  createCourse,
  updateCourse,
} from '../controllers/course';
import { authenticate, isInstructor } from '../middlewares';

const router = express.Router();

router.get('/all-courses', getAllPublishedCourses);
router.get('/course-categories', getCourseCategories);
router.get('/me/taught-courses', authenticate, isInstructor, getTaughtCourses);
router.get('/me/posted-courses', authenticate, isInstructor, getPostedCourses);
router.post('/get-course', getCourse);
router.post('/create-course', authenticate, isInstructor, createCourse);
router.put('/course/:id', authenticate, isInstructor, updateCourse);

module.exports = router;
