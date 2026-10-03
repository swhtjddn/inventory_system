module.exports = (app, User, ensureAuthenticated) => {
  app.get("/api/employees", ensureAuthenticated, async (req, res, next) => {
    await User.find((err, employees) => {
      if (err) {
        res.status(500).send("Error pulling inventory");
      } else {
        res.json(employees);
      }
    });
  });

  app.get("/api/employees/:id", ensureAuthenticated, async (req, res, next) => {
    await User.findById(req.params.id, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        res.json(user);
      }
    });
  });

  app.patch(
    "/api/employees/:id",
    ensureAuthenticated,
    async (req, res, next) => {
      console.log(req.body);
      await User.updateOne(
        { _id: req.params.id },
        {
          $set: {
            username: req.body.username,
            location: req.body.location,
          },
        },
        (err, location) => {
          if (err) {
            res.status(500).send("Error changing user");
          } else {
            res.json({ redirectURL: "/app/employees" });
          }
        }
      );
    }
  );

  app.delete(
    "/api/employees/:id",
    ensureAuthenticated,
    async (req, res, next) => {
      await User.findByIdAndDelete(req.params.id, (err, employee) => {
        if (err) {
          console.log(err);
        } else {
          res.json(employee);
        }
      });
    }
  );
};
