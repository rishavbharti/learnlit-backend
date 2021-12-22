import { Course } from '../models/course';
import { Instructor } from '../models/instructor';
import { createSlug } from '../utils';

// @desc    Get course categories
// @route   GET /course-categories
// @access  Public
const getCourseCategories = async (req, res) => {
  try {
    return res.status(201).send(require(`../data/courseCategories`));
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

// @desc    Get taught courses
// @route   GET /me/taught-courses
// @access  Private
const getTaughtCourses = async (req, res) => {
  try {
    const instructorId = req.user.toObject().instructorProfile[0];

    const instructor = await Instructor.findById(instructorId);
    if (!instructor.courses.length) {
      return res.status(200).json([]);
    }

    const courses = await Course.find({ _id: { $in: instructor.courses } });
    return res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

// @desc    Get course
// @route   GET /course/:id
// @access  Public
const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ errorMessage: 'Missing course id' });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(400).send({ errorMessage: 'Invalid course id' });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

// @desc    Create a new course
// @route   POST /course
// @access  Private
const createCourse = async (req, res) => {
  try {
    const slug = createSlug(req.body.title);

    const titleExists = await Course.findOne({
      slug,
    });

    if (titleExists)
      return res.status(400).send({ errorMessage: 'Title is taken' });

    const course = new Course({
      slug,
      ...req.body,
      postedBy: req.user._id,
      instructors: req.user.toObject().instructorProfile[0],
    });
    await course.save();

    await Instructor.findByIdAndUpdate(
      req.user.toObject().instructorProfile[0],
      {
        $addToSet: {
          courses: course._id,
        },
      },
      {
        new: true,
        strict: false,
      }
    );

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

// @desc    Update a course
// @route   PUT /course/:id
// @access  Private
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send('Missing course id');
    }

    const course = await Course.findOneAndUpdate(
      { _id: id, postedBy: req.user._id },
      req.body,
      { new: true }
    );

    if (!course) {
      return res.status(400).send('Invalid course id');
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

export {
  getCourseCategories,
  getTaughtCourses,
  getCourse,
  createCourse,
  updateCourse,
};
