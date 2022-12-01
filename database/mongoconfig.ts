const mongoose = require("mongoose");

async function startMongoClient() {
  await mongoose.connect("mongodb://localhost:27017/not-ion");
}

startMongoClient().then((r) => console.log("connected to mongo client"));

export default mongoose;
