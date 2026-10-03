module.exports = (app, Suggestions, Location, ensureAuthenticated) => {
  app.get("/api/suggestions", ensureAuthenticated, async (req, res, next) => {
    await Suggestions.find(function (err, requests) {
      if (err) {
        res.status(500).send("Error pulling Requests");
      } else {
        res.json(requests);
      }
    });
  });

  app.post(
    "/api/suggestion/add",
    ensureAuthenticated,
    async (req, res, next) => {
      const { requester, location, title, suggestion } = req.body;

      let newSuggestion = new Suggestions();
      newSuggestion.title = title;
      newSuggestion.requester = requester;
      newSuggestion.suggestion = suggestion;
      newSuggestion.location = location;

      await newSuggestion.save();
      res.json({ redirectURL: "/" });
    }
  );

  app.patch(
    "/api/suggestion/:id",
    ensureAuthenticated,
    async (req, res, next) => {
      await Suggestions.updateOne(
        { _id: req.params.id },
        {
          $set: {
            status: req.body.status,
          },
        },
        (err, suggestion) => {
          if (err) {
            res.status(500).send("Error changing suggestion");
          } else {
            res.json(suggestion);
          }
        }
      );
    }
  );
};
