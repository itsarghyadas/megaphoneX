import mongoose, { Model, Document, Schema } from "mongoose";

interface IUnsendDmUsersDataSchema extends Document {
  tweetid: string;
  timestamp: string;
  unsentusers: string[];
  unsentprofileimageurl: string[];
}
const unsendUserDmSchema = new Schema<IUnsendDmUsersDataSchema>(
  {
    tweetid: { type: String, required: true },
    timestamp: {
      type: String,
      required: true,
    },
    unsentusers: { type: [String], required: true },
    unsentprofileimageurl: { type: [String], required: true },
  },
  { collection: "unsentdmprofile" }
);

const UnsentDmDetails: Model<IUnsendDmUsersDataSchema> = mongoose.models
  .UnsentDmDetails
  ? mongoose.models.UnsentDmDetails
  : mongoose.model<IUnsendDmUsersDataSchema>(
      "UnsentDmDetails",
      unsendUserDmSchema
    );

export default UnsentDmDetails;
