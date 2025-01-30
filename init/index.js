const mongoose = require("mongoose");
let initData = require(__dirname + "/data.js");
const Listing = require(__dirname + "/../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connection status:", mongoose.connection.readyState);
    console.log("connected to db");
    console.log("Calling initDB...");
    await initDB();
    console.log("InitDB finished");
  } catch (err) {
    console.error("Database connection or initialization error:", err);
  }
}

const initDB = async () => {
  try {
    console.log("starting database initialization");
    await Listing.deleteMany({});
    console.log("Existing data was deleted");
    initData.data = initData.data.map((obj)=> ({ ...obj, owner: "66f265364ad9f7633312e5ea" })); 
    const result = await Listing.insertMany(initData.data);
    console.log("Data was initialized:", result);
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};

main();