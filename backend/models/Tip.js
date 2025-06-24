const mongoose = require("mongoose");

const tipSchema = new mongoose.Schema(
  {
    milestone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Milestone",
      required: true,
    },
    userName: { type: String, required: true },
    tipText: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tip", tipSchema);
