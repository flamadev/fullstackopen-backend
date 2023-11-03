const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] :response-time ms :body')
);

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
});

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: ' 12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122',
  },
];
let info = persons.length;
const time = new Date();

app.get('/', (request, response) => {
  response.send('<h1>Phones</h1>');
});
app.get('/api/persons', (request, response) => {
  response.json(persons);
});
app.get('/info', (request, response) => {
  response.send(`<p>Phone has info for ${info} people</p> <br />
  <p>${time}</p>`);
});
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  person ? response.send(person) : response.status(404).end();
});
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});
app.post('/api/persons', (request, response) => {
  const person = request.body;
  const ids = persons.map((person) => person.id);
  const generateId = () => {
    const maxId =
      persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
    return maxId + 1;
  };

  const newPerson = {
    id: generateId(),
    name: person.name,
    number: person.number,
  };

  if (!person.name) {
    return response.status(400).json({
      error: 'name is empty',
    });
  } else if (!person.number) {
    return response.status(400).json({
      error: 'number is empty',
    });
  } else {
    persons = persons.concat(newPerson);
    response.status(201).json(newPerson);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
