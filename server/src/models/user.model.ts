import bcryptjs from 'bcryptjs';
import { model, Schema } from 'mongoose';

import { User } from '@types';

const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {
    id: true,
    timestamps: true,

    methods: {
      comparePassword: function (submittedPassword: string) {
        return bcryptjs.compare(submittedPassword, this.password);
      },

      toJSON: function () {
        const obj = this.toObject();
        delete obj.password;
        delete obj._id;
        return obj;
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const UserModel = model<User>('User', userSchema);
