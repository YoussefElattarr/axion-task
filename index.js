const config = require("./config/index.config.js");
const Cortex = require("ion-cortex");
const ManagersLoader = require("./loaders/ManagersLoader.js");
const Aeon = require("aeon-machine");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const db = config.dotEnv.MONGO_URI;
const Mongo = require("./connect/mongo.js");
const Admin = require("./routes/admin");
const Login = require("./routes/login");
const School = require("./routes/school");
const Classroom = require("./routes/classroom");
const Student = require("./routes/student");

Mongo({ uri: db });

const app = express();
//allow cors
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h3>HOMEPAGE<h3>");
});

app.use("/admin", Admin);
app.use("/login", Login);
app.use("/school", School);
app.use("/classroom", Classroom);
app.use("/student", Student);

app.use((req, res) => {
  res
    .status(404)
    .send({ error: "Obi-Wan: You don't need to see this page..." });
});

app.listen(port || 80, "0.0.0.0", () => {
  console.log(`Listening on port ${port}`);
});

process.on("uncaughtException", (err) => {
  console.log(`Uncaught Exception:`);
  console.log(err, err.stack);

  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled rejection at ", promise, `reason:`, reason);
  process.exit(1);
});

const cache = require("./cache/cache.dbh")({
  prefix: config.dotEnv.CACHE_PREFIX,
  url: config.dotEnv.CACHE_REDIS,
});

const Oyster = require("oyster-db");
const oyster = new Oyster({
  url: config.dotEnv.OYSTER_REDIS,
  prefix: config.dotEnv.OYSTER_PREFIX,
});

const cortex = new Cortex({
  prefix: config.dotEnv.CORTEX_PREFIX,
  url: config.dotEnv.CORTEX_REDIS,
  type: config.dotEnv.CORTEX_TYPE,
  state: () => {
    return {};
  },
  activeDelay: "50",
  idlDelay: "200",
});
const aeon = new Aeon({
  cortex,
  timestampFrom: Date.now(),
  segmantDuration: 500,
});

const managersLoader = new ManagersLoader({
  config,
  cache,
  cortex,
  oyster,
  aeon,
});
const managers = managersLoader.load();

managers.userServer.run();
