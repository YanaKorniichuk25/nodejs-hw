import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String },
    avatar: {
      type: String,
      default: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function () {
  if (!this.username) {
    this.username = this.email;
  }

  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

export default model('User', userSchema);
