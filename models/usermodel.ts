import mongoose, { Model, Document, Schema } from "mongoose";

interface IUserDataSchema extends Document {
  user_id: string;
  username: string;
  useremail: string;
  credits: number;
}

const userSchema = new Schema<IUserDataSchema>(
  {
    user_id: { type: String, required: true },
    username: { type: String, required: true },
    useremail: { type: String, required: true },
    credits: { type: Number, required: true },
  },
  { collection: "users" }
);

const User: Model<IUserDataSchema> = mongoose.models.User
  ? mongoose.models.User
  : mongoose.model<IUserDataSchema>("User", userSchema);

export default User;
