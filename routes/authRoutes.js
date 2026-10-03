const passport = require("passport");

module.exports = (app, User) => {
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).send(info);
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        if (user.role === "admin") {
          return res.json({ redirectURL: "/" });
        }
        if (user.role === "employee") {
          return res.json({ redirectURL: "/request" });
        }
      });
    })(req, res, next);
  });

  app.post("/register", async (req, res) => {
    const { username, password, role, location } = req.body;
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).send("That user already exisits!");
    } else {
      let newUser = new User();
      newUser.username = username;
      newUser.password = newUser.generateHash(password);
      newUser.role = role;
      newUser.location = location;

      await newUser.save();
      res.json({ redirectURL: "/" });
    }
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};
