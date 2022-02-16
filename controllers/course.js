import { Course } from '../models/course';
import { Instructor } from '../models/instructor';
import { createSlug, snakeCaseToTitle } from '../utils';

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

// @desc    Get all published courses
// @route   GET /all-courses
// @access  Public
const getAllPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      published: { $in: true },
    })
      .lean()
      .populate('instructors', 'name')
      .select('-meta -curriculum');

    return res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

// @desc    Get categorized courses
// @route   GET /courses?category=development&subCategory=web-development
// @access  Public
const getCategoryCourses = async (req, res) => {
  try {
    const { query, category, subCategory } = req.query;

    let courses;
    if (query) {
      courses = await Course.find({
        published: { $in: true },
        $and: [{ $text: { $search: query } }],
      })
        .lean()
        .populate('instructors', 'name')
        .select('-meta -curriculum');

      return res.status(200).json({ courses });
    }

    const categoryName = category && snakeCaseToTitle(category);
    const subCategoryName = subCategory && snakeCaseToTitle(subCategory);

    const title = `${subCategoryName || categoryName} Courses`;

    if (category && !subCategory) {
      courses = await Course.find({
        published: { $in: true },
        category: { $eq: categoryName },
      })
        .lean()
        .populate('instructors', 'name')
        .select('-meta -curriculum');
    } else if (!category && subCategory) {
      courses = await Course.find({
        published: { $in: true },
        subCategory: { $eq: subCategoryName },
      })
        .lean()
        .populate('instructors', 'name')
        .select('-meta -curriculum');
    } else if (category && subCategory) {
      courses = await Course.find({
        published: { $in: true },
        category: { $eq: categoryName },
        subCategory: { $eq: subCategoryName },
      })
        .lean()
        .populate('instructors', 'name')
        .select('-meta -curriculum');
    }

    return res.status(200).json({ title, courses });
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
    const instructorId = req.user.toObject().instructorProfile;

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

// @desc    Get posted courses
// @route   GET /me/posted-courses
// @access  Private
const getPostedCourses = async (req, res) => {
  try {
    const user = req.user.toObject();

    if (
      !Object.prototype.hasOwnProperty.call(user, 'postedCourses') ||
      !user.postedCourses.length
    ) {
      return res.status(200).json([]);
    }

    const courses = await Course.find({ _id: { $in: user.postedCourses } });
    return res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

// @desc    Get course based on id or slug
// @route   POST /course
// @access  Public
const getCourse = async (req, res) => {
  try {
    const { userId, id, slug } = req.body;

    if (!(id || slug)) {
      return res.status(400).send({ errorMessage: 'Missing course id/slug' });
    }

    let course;

    if (id) {
      course = await Course.findById(id).populate('instructors').lean();
    } else if (slug) {
      course = await Course.findOne({
        slug,
      })
        .lean()
        .populate('instructors');
    }

    if (!course) {
      return res.status(400).send({ errorMessage: 'Invalid course id/slug' });
    }

    if (userId) {
      const isUserEnrolled = course.meta.enrollments.find(
        (_id) => _id.toString() === userId
      );

      course.isUserEnrolled = Boolean(isUserEnrolled);
      delete course.meta.enrollments;
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
    });
    await course.save();

    // await User.findByIdAndUpdate(
    //   req.user._id,
    //   {
    //     $addToSet: {
    //       postedCourses: course._id,
    //     },
    //   },
    //   {
    //     new: true,
    //     strict: false,
    //   }
    // );

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

    if (Object.prototype.hasOwnProperty.call(req.body, 'meta')) {
      return res.status(400).send('Bad request');
    }

    const course = await Course.findOneAndUpdate(
      { _id: id, postedBy: req.user._id },
      req.body,
      { new: true }
    );

    if (!course) {
      return res.status(400).send('Invalid course id');
    }

    res.status(200).json(course);

    // Expect instructor id in the request body. If it's an array, only use the first id
    // ToDo: If instructor is updated, remove course id from the existing one
    if (Object.prototype.hasOwnProperty.call(req.body, 'instructors')) {
      const instructorId = req.body.instructors[0];
      await Instructor.findByIdAndUpdate(
        instructorId,
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
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

// @desc    Search courses
// @route   GET /courses/search?query=development
// @access  Public
const searchCourses = async (req, res) => {
  try {
    const { query } = req.query;

    const courses = await Course.find({
      published: { $in: true },
      $and: [{ $text: { $search: query } }],
    })
      .lean()
      .populate('instructors', 'name')
      .select('-meta -curriculum');

    return res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

export {
  getCourseCategories,
  getAllPublishedCourses,
  getCategoryCourses,
  getTaughtCourses,
  getPostedCourses,
  getCourse,
  createCourse,
  updateCourse,
  searchCourses,
};
