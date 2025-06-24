const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/milestones", require("./routes/milestone"));
app.use("/api/tips", require("./routes/tips"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    )
  )
  .catch((err) => console.error(err));
