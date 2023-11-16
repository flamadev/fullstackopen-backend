const mongoose = require('mongoose');
require('dotenv').config();
const connectionString = process.env.MONGODB_URI;
mongoose
  .connect(connectionString)
  .then(() => console.log('database connected'))
  .catch((err) => console.log(err));
