module.exports = (app, Request, ensureAuthenticated) => {
  app.post("/api/stats", ensureAuthenticated, async (req, res, next) => {
    const requests = await Request.find({
      dateRequested: { $gt: req.body.start, $lt: req.body.end },
      requester: req.body.employee,
    });
    res.json(requests);
  });

  app.post("/api/salonstats", ensureAuthenticated, async (req, res, next) => {
    const requests = await Request.find({
      dateRequested: { $gt: req.body.start, $lt: req.body.end },
    });
    res.json(requests);
  });
};
