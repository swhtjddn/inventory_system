const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");
const User = require("./models/Users");
const Item = require("./models/Inventory");
const Location = require("./models/Locations");
const Request = require("./models/Requests");
const Lashfix = require("./models/Lashfix");
const Training = require("./models/Training");
const TrainingRequests = require("./models/TrainingRequests");
const Issues = require("./models/Issues");
const Supplies = require("./models/SuppliesRequest");
const Suggestions = require("./models/Suggestions");
const sgMail = require("@sendgrid/mail");

require("./passport/setup");

mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(keys.MONGO_URI, mongooseOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

const app = express();

sgMail.setApiKey(keys.sendGrid);

let ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect("/login");
};

let requireAdmin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Please log in.'
    })
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required.'
    })
  }    
  return next();
}

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app, User, requireAdmin);
require("./routes/employeeRoutes")(app, User, ensureAuthenticated);
require("./routes/inventoryRoutes")(app, Item, ensureAuthenticated);
require("./routes/requestRoutes")(
  app,
  sgMail,
  Request,
  Item,
  Location,
  ensureAuthenticated
);
require("./routes/dashboardRoutes")(
  app,
  sgMail,
  Lashfix,
  User,
  Item,
  Request,
  Location
);
require("./routes/locationRoutes")(app, Location, ensureAuthenticated);
require("./routes/lashfixRoutes")(
  app,
  sgMail,
  Lashfix,
  Location,
  ensureAuthenticated
);
require("./routes/statsRoutes")(app, Request, ensureAuthenticated);
require("./routes/trainingRoutes")(app, Training, ensureAuthenticated);
require("./routes/trainingRequestRoutes")(
  app,
  TrainingRequests,
  ensureAuthenticated
);
require("./routes/issueRoutes")(app, Issues, Location, ensureAuthenticated);
require("./routes/suggestionRoutes")(
  app,
  Suggestions,
  Location,
  ensureAuthenticated
);
require("./routes/supplyRoutes")(
  app,
  sgMail,
  Supplies,
  Location,
  ensureAuthenticated
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT);
