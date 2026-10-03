module.exports = (app, Training, ensureAuthenticated) => {
  app.get("/api/trainings", ensureAuthenticated, async (req, res, next) => {
    await Training.find(function (err, trainings) {
      if (err) {
        res.status(500).send("Error pulling class list");
      } else {
        res.json(trainings);
      }
    });
  });

  app.post(
    "/api/trainings/add",
    ensureAuthenticated,
    async (req, res, next) => {
      // creator, title, description, attendees, date, startTime, maxCapacity, location
      const {
        creator,
        title,
        description,
        date,
        startTime,
        maxCapacity,
        location,
      } = req.body;

      let newTraining = new Training();
      newTraining.creator = creator;
      newTraining.title = title;
      newTraining.description = description;
      newTraining.date = date;
      newTraining.startTime = startTime;
      newTraining.maxCapacity = maxCapacity;
      newTraining.location = location;

      await newTraining.save();
      res.json({ redirectURL: "/" });
    }
  );

  app.patch(
    "/api/trainings/:id",
    ensureAuthenticated,
    async (req, res, next) => {
      const { attendee } = req.body;
      const training = await Training.findOne({ _id: req.params.id });

      if (training) {
        if (training.maxCapacity > training.attendees.length) {
          Training.updateOne(
            { _id: req.params.id },
            {
              $push: {
                attendees: attendee,
              },
            },
            (err, request) => {
              if (err) {
                res.status(500).send("");
              } else {
                res.json(request);
              }
            }
          );
        } else {
          return res.status(400).send("Training is full!");
        }
      } else {
        return res.status(400).send("Training No Longer Exists");
      }
    }
  );

  app.delete(
    "/api/trainings/:id",
    ensureAuthenticated,
    async (req, res, next) => {
      await Training.findByIdAndDelete(req.params.id, (err, request) => {
        if (err) {
          console.log(err);
        } else {
          res.json(request);
        }
      });
    }
  );
};
