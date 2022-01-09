import express from 'express';
import {
  addInstructor,
  makeInstructor,
  getInstructorProfile,
  updateInstructorProfile,
  getAddedInstructors,
} from '../controllers/instructor';
import { authenticate, isAdmin, isInstructor } from '../middlewares';

const router = express.Router();

router.post('/instructor/add', authenticate, addInstructor);
router.post('/become-instructor', authenticate, makeInstructor);
router.get('/instructor/:id', authenticate, getInstructorProfile);
router.put(
  '/instructor/:id',
  authenticate,
  isInstructor,
  updateInstructorProfile
);
router.get('/added-instructors', authenticate, getAddedInstructors);

module.exports = router;
