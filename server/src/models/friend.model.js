const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema(
  {
    friendsWithId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    friendsList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Friend = mongoose.model("Friend", friendSchema);

module.exports = Friend;
