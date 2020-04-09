const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

const users = require("./routes/users");
const players = require("./routes/players");

mongoose
  .connect("mongodb://localhost:27017/app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connect to database");
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/", express.static(__dirname));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/users", users);
app.use("/players", players);

const port = process.env.PORT || 5050;

app.set(port, "port");

app.listen(port, () => console.log(`Listening on port ${port}`));
