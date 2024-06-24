require("dotenv").config(); //allows using .env throughout our package
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require("./config/dbconn");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");

const app = express();
const PORT = process.env.PORT || 3001;

console.log(process.env.NODE_ENV);
connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "./public")));
app.use("/", require("./routes/root"));
app.use("/users", require("./routes/userRoutes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
});

mongoose.connection.on("error", (error) => {
  console.log(error);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
