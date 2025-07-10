import { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSceham = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Email is required!"],
    },
  },
  { timestamps: true }
);

userSceham.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSceham.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = models?.User || model("User", userSceham);

export default User;
