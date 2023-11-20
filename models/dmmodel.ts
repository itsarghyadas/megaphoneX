import mongoose, { Model, Document, Schema } from "mongoose";

interface IDmProfile extends Document {
  tweetid: string;
  timestamp: string;
  sentusers: string[];
  sentprofileimageurl: string[];
  unsentusers: string[];
  unsentprofileimageurl: string[];
}
const dmProdileSchema = new Schema<IDmProfile>(
  {
    tweetid: { type: String, required: true },
    timestamp: {
      type: String,
      required: true,
    },
    unsentusers: { type: [String], required: true },
    unsentprofileimageurl: { type: [String], required: true },
  },
  { collection: "dmprofile" }
);

const DmDetails: Model<IDmProfile> =
  mongoose.models.DmDetails ||
  mongoose.model<IDmProfile>("SentDMDetails", dmProdileSchema);

export default DmDetails;
