import mongoose from "mongoose";

const twitterFormSchema = new mongoose.Schema(
  {
    posturl: {
      type: String,
      required: true,
    },
    dmmessage: {
      type: String,
      required: true,
    },
    checkboxItems: {
      type: [String],
      required: true,
    },
    timeperiod: {
      type: String,
      required: true,
    },
    usernumber: {
      type: String,
      required: true,
    },
  },
  { collection: "twitterform" }
);

const TwitterForm = mongoose.model("TwitterForm", twitterFormSchema);

export default TwitterForm;
