require('dotenv').config();
const connectionString = process.env.MONGODB_URI;
const mongoose = require('mongoose');
const Person = require('./models/Person');

mongoose
  .connect(connectionString)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((err) => console.log('error connecting to MongoDB', err.message));

process.on('uncaughtException', () => {
  mongoose.connection.close();
});
