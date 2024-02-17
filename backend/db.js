const mongoose = require("mongoose");
mongoURI = "mongodb://localhost:27017/mynoteX";

const connectToMongo = async () => {
  await mongoose.connect(mongoURI);
  console.log("Connected to Mongoose!");
};

module.exports = connectToMongo;
