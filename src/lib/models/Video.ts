import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    recordedBy: {
      type: String,
    },
    hint: {
      type: String,
    },
    guessedBy: {
      type: String,
      default: null,
    },
    isSpecial: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Video =
  mongoose.models.Video || mongoose.model("Video", videoSchema);
