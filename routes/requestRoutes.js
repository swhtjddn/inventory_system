const keys = require("../config/keys");

module.exports = (
  app,
  sgMail,
  Request,
  Item,
  Location,
  ensureAuthenticated
) => {
  app.get("/api/request", ensureAuthenticated, async (req, res, next) => {
    await Request.find(function (err, requests) {
      if (err) {
        res.status(500).send("Error pulling Requests");
      } else {
        res.json(requests);
      }
    });
  });
  app.post("/api/request/add", ensureAuthenticated, async (req, res, next) => {
    const { requester, location, items } = req.body;
    let newRequest = new Request();
    newRequest.requester = requester;
    newRequest.items = items;

    const requesterLocation = await Location.findById(location);
    locationName = requesterLocation.name;

    let textNumber = keys.alerts.defaultNumber;

    if (locationName === "Eastern") {
      textNumber = keys.alerts.easternNumber;
    }

    const msg = {
      to: textNumber,
      from: keys.alerts.fromEmail,
      subject: `New Request from ${requester}`,
      text: ` 
            ${items.join(`
            `)}`,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent successfully");
      })
      .catch((error) => {
        console.error(error);
      });

    await newRequest.save();
    res.json({ redirectURL: "/" });
  });

  app.patch("/api/request/:id", ensureAuthenticated, async (req, res, next) => {
    const lowItems = [];
    // if the item is less than 0 do not decrement and send error
    req.body.items.forEach(async (item) => {
      await Item.updateOne(
        { name: item },
        {
          $inc: {
            quantity: -1,
          },
        }
      );
    });

    await Request.updateOne(
      { _id: req.params.id },
      {
        $set: {
          fulfilledBy: req.body.fulfilledBy,
          fulfilled: true,
          dateFulfilled: Date.now(),
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
  });

  app.delete(
    "/api/request/:id",
    ensureAuthenticated,
    async (req, res, next) => {
      await Request.findByIdAndDelete(req.params.id, (err, request) => {
        if (err) {
          console.log(err);
        } else {
          res.json(request);
        }
      });
    }
  );
};
