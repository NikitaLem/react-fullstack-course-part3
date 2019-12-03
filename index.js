const resource = "/api/persons";
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "34-44-53223523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
];

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");

morgan.token('with-body', (req, res) => {
  const prefix = ':method :url :status :res[content-length] - :response-time ms';
  const content = JSON.stringify(req.body);
  return `${prefix} ${content}`;
});

app.post(
  resource,
  bodyParser.urlencoded({
    extended: true
  }),
  bodyParser.json(),
  morgan("with-body")
);

const generateId = () => {
  let id = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
  const check = persons.find(p => p.id === id);
  return check ? generateId() : id;
};

app.get(resource, (req, res) => {
  res.json(persons);
});

app.get(`${resource}/:id`, (req, res) => {
  const id = +req.params.id;
  const person = persons.find(p => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete(`${resource}/:id`, (req, res) => {
  const id = +req.params.id;
  persons = persons.filter(p => p.id !== id);
  res.status(204).end();
});

app.post(resource, (req, res) => {
  const { name, number } = req.body;

  if (!name && !number) {
    return res.status(400).json({
      error: "name and number is required!"
    });
  }

  if (persons.find(p => p.name === name)) {
    return res.status(400).json({
      error: "name must be unique!"
    });
  }

  const person = {
    id: generateId(),
    name,
    number
  };

  persons = persons.concat(person);
  res.json(person);
});

app.get("/info", (req, res) => {
  const countInfo = `<p>Phonebook has info for ${persons.length} people</p>`;
  const reqTimeInfo = `<p>${new Date()}</p>`;
  res.send(`${countInfo}${reqTimeInfo}`);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
