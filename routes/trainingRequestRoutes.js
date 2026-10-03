module.exports = (app, TrainingRequests, ensureAuthenticated) => {
  app.get(
    "/api/trainings/requests",
    ensureAuthenticated,
    async (req, res, next) => {
      await TrainingRequests.find(function (err, trainingRequests) {
        if (err) {
          res.status(500).send("Error pulling class list");
        } else {
          res.json(trainingRequests);
        }
      });
    }
  );

  // requester, subject, description, dateRequested, dateReviewed, reviewed, reviewedBy, location
  app.post(
    "/api/training/request",
    ensureAuthenticated,
    async (req, res, next) => {
      const { requester, subject, description, location } = req.body;
      let newTrainingRequest = new TrainingRequests();
      newTrainingRequest.requester = requester;
      newTrainingRequest.subject = subject;
      newTrainingRequest.description = description;
      newTrainingRequest.location = location;

      await newTrainingRequest.save();
      res.json({ redirectURL: "/" });
    }
  );

  app.patch(
    "/api/training/request/:id",
    ensureAuthenticated,
    async (req, res, next) => {
      await TrainingRequests.updateOne(
        { _id: req.params.id },
        {
          $set: {
            reviewedBy: req.body.reviewedBy,
            reviewed: true,
            dateReviewed: Date.now(),
          },
        },
        (err, request) => {
          if (err) {
            res.status(500).send("Error changing request");
          } else {
            res.json(request);
          }
        }
      );
    }
  );
};
