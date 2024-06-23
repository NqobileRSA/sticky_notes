const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origins: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by cors"));
    }
  },
  Credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
