const express = require('express');
const router = express.Router();

app.post(
  resource,
  express.json(),
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
