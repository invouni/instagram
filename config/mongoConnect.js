const configData = require('../src/config/config.js')

const uri = configData.MONGO_URI;

// Function to connect to MongoDB
function mongoConnect(mongoose) {
  mongoose
    .connect(uri)
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
}

module.exports = mongoConnect;