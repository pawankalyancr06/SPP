const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Support either MONGO_URI or MONGODB_URI env var (README used MONGODB_URI)
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

        if (!uri) {
            throw new Error('Environment variable MONGO_URI or MONGODB_URI must be set');
        }

        // mongoose.connect returns a promise, so we await it
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        // Exit the process with failure
        process.exit(1);
    }
};

module.exports = connectDB;