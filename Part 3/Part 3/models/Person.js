const { Schema, model } = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const personSchema = new Schema({
  name: { type: String, minlength: 3, required: true, unique: true },
  number: { type: String, minlength: 8, required: true, unique: true },
});

personSchema.plugin(uniqueValidator);
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Person = new model('Person', personSchema, 'persons');

module.exports = Person;
