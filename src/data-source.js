const mongoose = require('mongoose');
// const MongoDb =  'mongodb://127.0.0.1:27017/dine&dash';
const MongoDb =  process.env.dbUrl;
if (!MongoDb) {
    throw new Error('MongoDB connection string is not defined in environment variables');
}
class Database {
    static async connect() {
        try {
            await mongoose.connect(MongoDb);
            console.log('MongoDB connected successfully');
        } catch (err) {
            console.error('MongoDB connection error:', err);
            throw err; // Rethrow the error to be caught in the server.js
        }
    }
    static async disconnect() {
        try {
            await mongoose.disconnect();
            console.log('DB disconnected successfully');
        } catch (err) {
            console.error('Error disconnecting from DB:', err);
        }
    }
}

module.exports = Database;