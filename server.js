// Import library
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const Sentry = require("@sentry/node");
// Import files.
const users = require("./routes/users");
const players = require("./routes/players");
const teams = require("./routes/teams");

// Middleware
Sentry.init({
  dsn:
    "https://b1766154aa9540b98a56767e50143a60@o376960.ingest.sentry.io/5198382",
});

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

app.use(Sentry.Handlers.requestHandler());

app.use("/users", users);
app.use("/players", players);
app.use("/teams", teams);


app.get("/test", (req, res) => {
  res.status(200).json({ message: "success" });
});

app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      if (error.status >= 400) {
        return true;
      }
      return false;
    },
  })
);



const port = process.env.PORT || 5050;
app.set(port, "port");

app.listen(port, () => console.log(`Listening on port ${port}`));
