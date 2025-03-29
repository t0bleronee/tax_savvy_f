const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
/*
// Connection string (hardcoded for now, but it's better to use process.env variables for security)
const connectString="mongodb+srv://kurlepurajesh18:EFrpJGLzLU8kWfbg@cluster0.0xebg.mongodb.net/products?retryWrites=true&w=majority&appName=Cluster0"

// OR use environment variable (recommended)
// const connectString = process.env.MONGO_URI;

const connectDB1 = async () => {
    try {
        const conn = await mongoose.connect(connectString);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { connectDB1 };

*/


// Local MongoDB Compass connection
const localDB = mongoose.createConnection("mongodb://127.0.0.1:27017/user", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB Atlas (Cloud) connection
const comDB = mongoose.createConnection(
 "mongodb+srv://kurlepurajesh18:EFrpJGLzLU8kWfbg@cluster0.0xebg.mongodb.net/products?retryWrites=true&w=majority&appName=Cluster0",

  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Check connection status
localDB.once("open", () => console.log("Connected to Local MongoDB"));
comDB.once("open", () => console.log("Connected to MongoDB compass"));

// Export databases
module.exports = { localDB, comDB };
