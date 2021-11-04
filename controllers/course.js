import { Course } from '../models/course';
import { Instructor } from '../models/instructor';
import { createSlug } from '../utils';

// @desc    Create a new course
// @route   /course
// @access  Private
const createCourse = async (req, res) => {
  try {
    const slug = createSlug(req.body.title);

    const titleExists = await Course.findOne({
      slug,
    });

    if (titleExists) return res.status(400).send('Title is taken');

    const course = new Course({
      slug,
      ...req.body,
      postedBy: req.user._id,
      instructors: req.user.toObject().instructorProfile[0],
    });
    await course.save();

    await Instructor.findByIdAndUpdate(
      req.user._id,
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

    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

export { createCourse };
