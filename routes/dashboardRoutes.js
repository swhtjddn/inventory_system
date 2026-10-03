const keys = require("../config/keys");

module.exports = (app, sgMail, Lashfix, User, Item, Request, Location) => {
  // count total number of unfulfilled requests.
  // count total number of fulfilled requests
  // count total number of requests
  // count total number of employees
  // count total number of products

  app.get("/api/dashboard", async (req, res, next) => {
    let fulfilledCount,
      unfulfilledCount,
      requestCount,
      employeesCount,
      productCount;
    requestCount = await Request.countDocuments();
    fulfilledCount = await Request.countDocuments({ fulfilled: true });
    unfulfilledCount = await Request.countDocuments({ fulfilled: false });
    employeesCount = await User.countDocuments();
    productCount = await Item.countDocuments();

    const data = {
      requestCount,
      fulfilledCount,
      unfulfilledCount,
      employeesCount,
      productCount,
    };

    res.json(data);
  });

  app.post("/api/callReceptionist", async (req, res, next) => {
    const { requester, location } = req.body;

    const requesterLocation = await Location.findById(location);
    locationName = requesterLocation.name;

    let textNumber = keys.alerts.defaultNumber;

    if (locationName === "Eastern") {
      textNumber = keys.alerts.easternNumber;
    }

    const msg = {
      to: textNumber,
      from: keys.alerts.fromEmail,
      subject: `Need assistance!`,
      text: `${requester} needs assistance at the front desk`,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Text sent successfully");
      })
      .catch((error) => {
        console.error(error);
      });

    res.json({ redirectURL: "/" });
  });

  app.post("/api/employeeDashboard", async (req, res, next) => {
    let lashFixCount;
    lashFixCount = await Lashfix.countDocuments({
      dateRequested: { $gt: req.body.start, $lt: req.body.end },
      originalArtist: { $eq: req.body.originalArtist },
    });

    const data = {
      lashFixCount,
    };

    res.json(data);
  });
};
