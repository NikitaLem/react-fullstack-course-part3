const express = require("express");
const app = express();
const cors = require('cors');
const personsRouter = require('./routes/persons');
const resource = "/api/persons";

app.use(cors());
app.use(express.static('build'));
app.use(resource, personsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
