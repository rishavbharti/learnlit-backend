import mongoose from 'mongoose';

const { Schema } = mongoose;

const { ObjectId } = mongoose.Schema;

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
    slug: { type: String, lowercase: true, unique: true },
    description: {
      type: String,
      // required: true,
    },
    highlights: { type: [String] },
    prerequisites: { type: [String] },
    targetAudience: String,
    category: { type: String, required: true },
    subCategory: {
      type: String,
      // required: true
    },
    language: {
      type: String,
      // required: true
    },
    duration: {
      type: String,
      // required: true
    },
    createdDate: { type: Date },
    updatedDate: { type: Date },

    coverImage: {
      type: {},
      default: '/course_cover.svg',
      // required: true,
    },
    previewMedia: { type: String },
    resources: { type: {} },

    curriculum: {
      type: [curriculum],
      // required: true
    },
    postedBy: { type: ObjectId, ref: 'User', required: true },
    instructors: { type: [ObjectId], ref: 'Instructor', required: true },
    level: {
      type: String,
      // required: true,
      enum: ['Beginner', 'Intermediate', 'Expert', 'All Levels'],
    },
    pricing: { type: String, enum: ['Free', 'Paid'] },
    price: { type: Number },
    published: { type: Boolean, default: false },
    hidePlayerBranding: { type: Boolean, default: false },
    meta: {
      enrollments: Number,
      rating: Number,
      numberOfRatings: Number,
      reviews: [{ body: String, date: Date }],
    },
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model('Course', courseSchema);
