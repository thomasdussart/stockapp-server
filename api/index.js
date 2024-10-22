const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { db } = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");
const path = require("path");
const fs = require("fs");

app.use(bodyParser.json());
app.use(cors());

require("../middleware/allowCors");

// connect DB
db;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// // routes depot
// require("./routes/depot", verifyToken)(app);
// // routes stock
// require("./routes/stock", verifyToken)(app);
// // Routes LSR
// require("./routes/lsr", verifyToken)(app);
// // Routes GH
// require("./routes/gh", verifyToken)(app);
// // Routes Thisnes
// require("./routes/thisnes", verifyToken)(app);
// // Routes Merdorp
// require("./routes/merdorp", verifyToken)(app);

// // Routes login
// require("./routes/login")(app);
// // Routes users
// require("./routes/users")(app);
// // Routes notifications
// require("./routes/notifications", verifyToken)(app);
// // Routes livraisons
// require("./routes/livraisons", verifyToken)(app);

const routesPath = path.join(__dirname, "..", "routes");
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const route = require(path.join(routesPath, file));
    if (file === "login.js" || file === "users.js") {
      route(app); // No token verification for login and users routes
    } else {
      route(app, verifyToken); // Token verification for other routes
    }
  }
});

app.listen(1337, () => {
  console.log("Server listening on port 1337");
});
