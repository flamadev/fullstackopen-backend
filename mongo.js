require('dotenv').config();
const connectionString = process.env.MONGODB_URI;
const mongoose = require('mongoose');
const Person = require('./models/Person');

mongoose
  .connect(connectionString)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((err) => console.log('error connecting to MongoDB', error.message));

process.on('uncaughtException', () => {
  mongoose.connection.close();
});

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node mongo.js <password> [name] [number]');
  process.exit(1);
}
const password = args[0];

if (args.length === 1) {
  mongoose
    .connect(connectionString)
    .then(() => {
      Person.find({}).then((persons) => {
        console.log('phonebook:');
        persons.forEach((person) => {
          console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
      });
    })
    .catch((err) => {
      console.error('Error:', err);
      mongoose.connection.close();
      process.exit(1);
    });
} else if (args.length === 3) {
  const name = args[1];
  const number = args[2];

  mongoose
    .connect(connectionString)
    .then(() => {
      const newPerson = new Person({
        name,
        number,
      });

      newPerson.save().then((savedPerson) => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
      });
    })
    .catch((err) => {
      console.error('Error:', err);
      mongoose.connection.close();
      process.exit(1);
    });
} else {
  console.log('Usage: node mongo.js <password> [name] [number]');
  process.exit(1);
}
