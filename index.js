const resource = "/api/persons";

const express = require("express");
const fs = require('fs');
const app = express();
const morgan = require("morgan");

morgan.token('with-body', (req, res) => {
  const prefix = ':method :url :status :res[content-length] - :response-time ms';
  const content = JSON.stringify(req.body);
  return `${prefix} ${content}`;
});

app.post(
  resource,
  express.json(),
  morgan("with-body")
);

const generateId = data => {
  let id = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
  const check = data.find(p => p.id === id);
  return check ? generateId(data) : id;
};

app.get(resource, (req, res) => {
  fs.readFile('./db.json', 'utf-8', (err, data) => {
    res.json(JSON.parse(data));
  });
});

app.get(`${resource}/:id`, (req, res) => {
  const id = +req.params.id;
  fs.readFile('./db.json', 'utf-8', (err, data) => {
    let persons = JSON.parse(data);
    person = persons.find(p => p.id === id);

    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  });
});

app.delete(`${resource}/:id`, (req, res) => {
  const id = +req.params.id;
  fs.readFile('./db.json', 'utf-8', (err, data) => {
    let persons = JSON.parse(data);
    persons = persons.filter(p => p.id !== id);
    fs.writeFile('./db.json', JSON.stringify(persons), 'utf-8', () => {
      res.status(204).end();
    });
  });
});

app.post(resource, (req, res) => {
  const { name, number } = req.body;

  if (!name && !number) {
    return res.status(400).json({
      error: "name and number is required!"
    });
  }

  fs.readFile('./db.json', 'utf-8', (err, data) => {
    let persons = JSON.parse(data);
    
    if (persons.find(p => p.name === name)) {
      return res.status(400).json({
        error: "name must be unique!"
      });
    }

    const person = {
      id: generateId(persons),
      name,
      number
    };
  
    persons = persons.concat(person);
    fs.writeFile('./db.json', JSON.stringify(persons), 'utf-8', () => {
      res.json(person);
    });
  });
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
