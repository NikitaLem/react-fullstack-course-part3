const express = require("express");
const app = express();
const cors = require('cors');
const personsRouter = require('./routes/persons');
const resource = "/api/persons";

app.use(cors());
app.use(resource, personsRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
