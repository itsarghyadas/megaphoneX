import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    useremail: {
      type: String,
      required: true,
      unique: true,
    },
    credits: {
      type: Number,
      default: 0,
    },
  },
  { collection: "users" }
);

const User = mongoose.model("User", UserSchema);

export default User;
