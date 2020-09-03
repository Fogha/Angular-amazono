const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const config = require("./config");
const app = express();

mongoose.connect(
  config.database,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connected to db");
    }
  }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

// app.get("/", (req, res, next) => {
//   res.json({
//     user: "Armand",
//   });
// });

const userRoutes = require("./Routes/Account");
const { use } = require("./Routes/Account");
app.use("/api/accounts", userRoutes);

app.listen(config.port, (err) => {
  console.log("We die here ");
});
