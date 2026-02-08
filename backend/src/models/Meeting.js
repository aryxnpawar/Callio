import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    meetingCode: {
      type: String,
      required: true,
      unique: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const Meeting = mongoose.model("Meeting", meetingSchema);
export default Meeting;
