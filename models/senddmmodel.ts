import mongoose, { Model, Document, Schema } from "mongoose";

interface ISendDmUsersDataSchema extends Document {
  tweetid: string;
  timestamp: string;
  sentusers: string[];
  sentprofileimageurl: string[];
}
const sendDmUserSchema = new Schema<ISendDmUsersDataSchema>(
  {
    tweetid: { type: String, required: true },
    timestamp: {
      type: String,
      required: true,
    },
    sentusers: { type: [String], required: true },
    sentprofileimageurl: { type: [String], required: true },
  },
  { collection: "sentdmprofile" }
);

const SentDmDetails: Model<ISendDmUsersDataSchema> = mongoose.models
  .SentDmDetails
  ? mongoose.models.SentDmDetails
  : mongoose.model<ISendDmUsersDataSchema>("SentDmDetails", sendDmUserSchema);

export default SentDmDetails;
