import mongoose, { Model, Document, Schema } from "mongoose";
import moment from "moment";

interface ISubmittedTweetFromDocument extends Document {
  userID: string;
  tweetID: string;
  posturl: string;
  dmmessage: string;
  checkboxItems: string[];
  timeperiod: string;
  usernumber: string;
  status: string;
  timestamp: string;
}
const twitterFormSchema = new Schema<ISubmittedTweetFromDocument>(
  {
    userID: { type: String, required: true },
    tweetID: { type: String, required: true },
    posturl: { type: String, required: true },
    dmmessage: { type: String, required: true },
    checkboxItems: { type: [String], required: true },
    timeperiod: { type: String, required: true },
    usernumber: { type: String, required: true },
    status: { type: String, required: true },
    timestamp: {
      type: String,
      default: () => moment().format("Do MMM YYYY h:mma"),
    },
  },
  { collection: "twitterform" }
);

const TwitterForm: Model<ISubmittedTweetFromDocument> =
  mongoose.models.TwitterForm ||
  mongoose.model<ISubmittedTweetFromDocument>("TwitterForm", twitterFormSchema);

export default TwitterForm;
