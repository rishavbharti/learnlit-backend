import { Instructor } from '../models/instructor';
import { User } from '../models/user';

// @desc    Add new instructor
// @route   POST /api/instructor/add
// @access  Private
const addInstructor = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).send('Instructor name is required');
    }

    const instructor = new Instructor({ ...req.body, createdBy: req.user._id });
    await instructor.save();

    res.status(201).json(instructor);

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          createdInstructors: instructor._id,
        },
      },
      {
        new: true,
        strict: false,
      }
    );
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

// @desc    Creates an instructor profile. Updates the role of requesting user to "Instructor"
// @route   POST /api/become-instructor
// @access  Private
const makeInstructor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();

    if (user && !user.role.includes('Instructor')) {
      req.body.name = user.name;
      req.body.email = user.email;
    } else {
      return res.status(400).json('Already an Instructor');
    }

    const instructor = new Instructor({ ...req.body });
    await instructor.save();

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          instructorProfile: instructor._id,
          role: 'Instructor',
        },
      },
      {
        new: true,
        strict: false,
      }
    );

    return res.status(201).json(instructor);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

// @desc    Fetch instructor profile
// @route   GET /api/instructor/:id
// @access  Private
const getInstructorProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).send('Missing instructor id');
    }

    const instructor = await Instructor.findById(id);

    return res.status(200).json(instructor);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

// @desc    Update instructor profile
// @route   PUT /api/instructor/:id
// @access  Private
const updateInstructorProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).send('Missing instructor id');
    }

    const instructor = await Instructor.findByIdAndUpdate(id, req.body, {
      new: true,
      strict: false,
    });

    return res.status(200).json(instructor);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

const getAddedInstructors = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();
    const userData = user.toObject();

    let instructorIds = [];

    if (
      !Object.prototype.hasOwnProperty.call(userData, 'createdInstructors') ||
      !userData.createdInstructors.length
    ) {
      instructorIds = [userData.instructorProfile];
    } else {
      instructorIds = [
        userData.instructorProfile,
        ...userData.createdInstructors,
      ];
    }

    const instructors = await Instructor.find({
      _id: {
        $in: instructorIds,
      },
    });
    return res.status(200).json(instructors);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

export {
  addInstructor,
  makeInstructor,
  getInstructorProfile,
  updateInstructorProfile,
  getAddedInstructors,
};

/**
 * /make-instructor - For creating a stripe account for user & sending the registration url
 * /get-account-status - Verify whether the user has registered on stripe & update it's role to 'Instructor'
 *
 * Flow -
 * Make the user an instructor as soon as the CTA is clicked on frontend.
 * Allow him/er to create free courses without an stripe account.
 * In case they wish to monetize their course, make it mandatory to setup payout details
 */
