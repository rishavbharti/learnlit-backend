import mongoose from 'mongoose';
import { User } from './user';

const { Schema } = mongoose;

const { ObjectId } = mongoose.Schema;

const enrolledUsers = new Schema(
  {
    id: ObjectId,
  },
  {
    _id: false,
    timestamps: {
      createdAt: 'enrolledOn',
      updatedAt: false,
    },
  }
);

const curriculum = new Schema({
  chapterTitle: {
    type: String,
    trim: true,
    minlength: 3,
    maxLength: 80,
    required: true,
  },
  duration: String,
  content: [
    {
      title: {
        type: String,
        trim: true,
        minlength: 3,
        maxLength: 80,
        required: true,
      },
      class: { type: String, required: true, enum: ['Lecture', 'Quiz'] },
      embedUrl: { type: String, required: true },
      duration: String,
    },
  ],
});

/**
 * curriculum.virtual('totalLectures').get(function() {
 *    return this.content.length
 * })
 */

const courseSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 3,
      maxLength: 100,
      required: true,
      unique: true,
    },
    subtitle: {
      type: String,
      trim: true,
      minlength: 10,
      maxLength: 200,
    },
    slug: { type: String, lowercase: true, unique: true },
    description: {
      type: String,
    },
    highlights: { type: [] },
    prerequisites: { type: [] },
    targetAudience: [],
    category: { type: String, required: true },
    subCategory: {
      type: String,
    },
    language: {
      type: String,
    },
    duration: {
      type: String,
    },
    createdDate: { type: Date },
    updatedDate: { type: Date },

    coverImage: {
      type: {},
      default: '/course_cover.svg',
    },
    previewMedia: { type: String },
    resources: { type: {} },

    curriculum: {
      type: [curriculum],
    },
    postedBy: { type: ObjectId, ref: 'User', required: true },
    instructors: { type: [ObjectId], ref: 'Instructor' },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Expert', 'All Levels'],
    },
    pricing: { type: String, enum: ['Free', 'Paid'] },
    currency: { type: String, enum: ['INR', 'USD'] },
    price: { type: Number },
    published: { type: Boolean, default: false },
    hidePlayerBranding: { type: Boolean, default: false },
    meta: {
      enrollments: [{ type: enrolledUsers, ref: 'User' }],
      rating: Number,
      numberOfRatings: Number,
      reviews: [
        { body: String, reviewer: { type: ObjectId, ref: 'User' }, date: Date },
      ],
    },
  },
  {
    timestamps: true,
  },
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } }
);

courseSchema.index({
  title: 'text',
  category: 'text',
  subCategory: 'text',
});

courseSchema.virtual('totalEnrollments').get(function () {
  return this.meta.enrollments.length;
});

courseSchema.post('save', async (course) => {
  await User.findByIdAndUpdate(
    course.postedBy,
    {
      $addToSet: {
        postedCourses: course._id,
      },
    },
    {
      new: true,
      strict: false,
    }
  );
});

export const Course = mongoose.model('Course', courseSchema);
