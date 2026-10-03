module.exports = (app, Issues, Location, ensureAuthenticated) => {
  app.get("/api/issues", ensureAuthenticated, async (req, res, next) => {
    await Issues.find(function (err, requests) {
      if (err) {
        res.status(500).send("Error pulling Requests");
      } else {
        res.json(requests);
      }
    });
  });

  app.post("/api/issue/add", ensureAuthenticated, async (req, res, next) => {
    const { requester, location, clientName, description, issueType } =
      req.body;

    let newIssue = new Issues();
    newIssue.requester = requester;
    newIssue.clientName = clientName;
    newIssue.issueType = issueType;
    newIssue.description = description;

    const requesterLocation = await Location.findById(location);
    locationName = requesterLocation.name;

    await newIssue.save();
    res.json({ redirectURL: "/" });
  });

  app.post("/api/issues", ensureAuthenticated, async (req, res, next) => {
    const issues = await Issues.find({
      dateRequested: { $gt: req.body.start, $lt: req.body.end },
    });
    res.json(issues);
  });
};
