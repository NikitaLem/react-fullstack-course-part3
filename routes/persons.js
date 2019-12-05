const fs = require("fs");
const express = require('express');
const router = express.Router();
const morgan = require("morgan");

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
});

const dbPath = './db.json';
const { generateId } = require('../helpers');

router.post(
  '/',
  express.json(),
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

router.get('/', (req, res) => {
  fs.readFile(dbPath, 'utf-8', (err, data) => {
    res.json(JSON.parse(data));
  });
});

router.get('/:id', (req, res) => {
  const id = +req.params.id;
  fs.readFile(dbPath, 'utf-8', (err, data) => {
    let persons = JSON.parse(data);
    person = persons.find(p => p.id === id);

    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  });
});

router.delete('/:id', (req, res) => {
  const id = +req.params.id;
  fs.readFile(dbPath, 'utf-8', (err, data) => {
    let persons = JSON.parse(data);
    persons = persons.filter(p => p.id !== id);
    fs.writeFile(dbPath, JSON.stringify(persons), 'utf-8', () => {
      res.status(204).end();
    });
  });
});

router.post('/', (req, res) => {
  const { name, number } = req.body;

  if (!name && !number) {
    return res.status(400).json({
      error: "name and number is required!"
    });
  }

  fs.readFile(dbPath, 'utf-8', (err, data) => {
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
    fs.writeFile(dbPath, JSON.stringify(persons), 'utf-8', () => {
      res.json(person);
    });
  });
});

module.exports = router;
