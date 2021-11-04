import { Instructor } from '../models/instructor';
import { User } from '../models/user';

// @desc    Add new instructor
// @route   POST /api/instructor/add
// @access  Private, Admin
const addInstructor = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).send('Instructor name is required');
    }

    const instructor = new Instructor({ ...req.body });
    await instructor.save();

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          instructorProfile: instructor._id,
        },
      },
      {
        new: true,
        strict: false,
      }
    );

    res.status(200).json(instructor);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

// @desc    Creates an instructor profile. Updates the role of requesting user to "Instructor"
// @route   POST /api/instructor
// @access  Private
const makeInstructor = async (req, res) => {
  try {
    const { name } = req.body;
    let instructorName = '';

    const userProfile = await User.findById(req.user._id);

    if (name) {
      instructorName = name;
    } else {
      instructorName = userProfile.name;
    }

    const instructor = new Instructor({ ...req.body, name: instructorName });
    await instructor.save();

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          instructorProfile: instructor._id,
          role: 'Instructor',
        },
      },
      {
        new: true,
        strict: false,
      }
    );

    res.status(200).json(instructor);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
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

    res.status(200).json(instructor);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
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

    const instructor = await Instructor.findByIdAndUpdate(
      id,
      { ...req.body },
      {
        new: true,
        strict: false,
      }
    );

    res.status(200).json(instructor);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

export {
  addInstructor,
  makeInstructor,
  getInstructorProfile,
  updateInstructorProfile,
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
