require('dotenv').config();
require('./mongo');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/Person');
const notFound = require('./middleware/notFound');
const handleErrors = require('./middleware/handleErrors');
const app = express();
const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');
const time = new Date();
let info = Person.length;
app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] :response-time ms :body')
);
morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

Sentry.init({
  dsn: 'https://3dea079ef472a9783998c0a20c5fef53@o4506184287191040.ingest.sentry.io/4506184291188736',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],

  tracesSampleRate: 1.0,

  profilesSampleRate: 1.0,
});

app.get('/', (request, response) => {
  response.send('<h1>Phones</h1>');
});
app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});
app.get('/info', (request, response) => {
  response.send(`<p>Phone has info for ${info} people</p> <br />
  <p>${time}</p>`);
});
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      person ? response.send(person) : response.status(404).end();
    })
    .catch(next);
});
app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  const person = request.body;
  const newPersonInfo = {
    name: person.name,
    number: person.number,
  };

  Person.findByIdAndUpdate(id, newPersonInfo, {
    new: true,
    runValidators: true,
  })
    .then((result) => response.status(204).end())
    .catch(next);
});
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end();
    })
    .catch(next);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});
app.post('/api/persons', (request, response) => {
  const person = request.body;

  if (!person.name) {
    return response.status(400).json({
      error: 'name is empty',
    });
  } else if (!person.number) {
    return response.status(400).json({
      error: 'number is empty',
    });
  } else {
    const newPerson = new Person({
      name: person.name,
      number: person.number,
    });
    newPerson.save().then((savedPerson) => response.json(savedPerson));
  }
});

app.use(notFound);
app.use(Sentry.Handlers.errorHandler());
app.use(handleErrors);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
