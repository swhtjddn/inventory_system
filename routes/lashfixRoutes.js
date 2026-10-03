const keys = require("../config/keys");

module.exports = (app, sgMail, Lashfix, Location, ensureAuthenticated) => {
  app.get("/api/allfixes", ensureAuthenticated, async (req, res, next) => {
    await Lashfix.find(function (err, lashfix) {
      if (err) {
        res.status(500).send("Error pulling Lash Fixes");
      } else {
        res.json(lashfix);
      }
    });
  });

  app.post("/api/lashfix", ensureAuthenticated, async (req, res, next) => {
    const fixes = await Lashfix.find({
      dateRequested: { $gt: req.body.start, $lt: req.body.end },
    });
    res.json(fixes);
  });

  app.get("/api/mylashfixes", ensureAuthenticated, async (req, res, next) => {
    await Lashfix.find(
      { requester: { $eq: req.user.username } },
      function (err, lashfix) {
        if (err) {
          res.status(500).send("Error pulling Lash Fixes");
        } else {
          res.json(lashfix);
        }
      }
    );
  });

  app.post("/api/mylashfixes", ensureAuthenticated, async (req, res, next) => {
    await Lashfix.find(
      {
        dateRequested: { $gt: req.body.start, $lt: req.body.end },
        requester: { $eq: req.user.username },
      },
      function (err, lashfix) {
        if (err) {
          res.status(500).send("Error pulling Lash Fixes");
        } else {
          res.json(lashfix);
        }
      }
    );
  });

  app.post("/api/lashfix/add", ensureAuthenticated, async (req, res, next) => {
    const { requester, location, clientName, description } = req.body;
    let newLashfix = new Lashfix();
    newLashfix.requester = requester;
    newLashfix.clientName = clientName;
    newLashfix.description = description;

    const requesterLocation = await Location.findById(location);
    locationName = requesterLocation.name;

    const msg = {
      to: keys.alerts.lashfixNumber,
      from: keys.alerts.fromEmail,
      subject: `New Lash Fix request from ${requester}`,
      text: `Confirm now`,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent successfully");
      })
      .catch((error) => {
        console.error(error);
      });

    await newLashfix.save();
    res.json();
  });

  app.patch("/api/lashfix/:id", ensureAuthenticated, async (req, res, next) => {
    await Lashfix.updateOne(
      { _id: req.params.id },
      {
        $set: {
          reviewedBy: req.body.fulfilledBy,
          reviewed: true,
          dateConfirmed: Date.now(),
          commission: req.body.commissionSplit,
          originalArtist: req.body.originalArtist,
        },
      },
      (err, lashfix) => {
        if (err) {
          res.status(500).send("Error changing lashfix");
        } else {
          res.json(lashfix);
        }
      }
    );
  });

  app.delete(
    "/api/lashfix/:id",
    ensureAuthenticated,
    async (req, res, next) => {
      await LashFix.findByIdAndDelete(req.params.id, (err, lashfix) => {
        if (err) {
          console.log(err);
        } else {
          res.json(lashfix);
        }
      });
    }
  );
};
