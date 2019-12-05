const express = require("express");
const app = express();
const cors = require('cors');
const personsRouter = require('./routes/persons');
const resource = "/api/persons";

app.use(cors());
app.use(resource, personsRouter);

app.get("/info", (req, res) => {
  const countInfo = `<p>Phonebook has info for ${persons.length} people</p>`;
  const reqTimeInfo = `<p>${new Date()}</p>`;
  res.send(`${countInfo}${reqTimeInfo}`);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
