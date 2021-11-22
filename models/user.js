import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 20,
    },
    avatar: {
      type: String,
      default: '/avatar.svg',
    },
    role: {
      type: [String],
      default: ['Subscriber'],
      enum: ['Subscriber', 'Instructor', 'Admin'],
    },
    stripe_account_id: '',
    stripe_seller: {},
    stripeSession: {},
  },
  {
    timestamps: true,
  }
);

// userSchema.methods.comparePassword = function (password) {
//   return bcrypt.compare(password, this.password);
// };

export const User = mongoose.model('User', userSchema);
