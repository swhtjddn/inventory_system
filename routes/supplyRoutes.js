const keys = require("../config/keys");

module.exports = (app, sgMail, Supplies, Location, ensureAuthenticated) => {
  app.get("/api/supplies", ensureAuthenticated, async (req, res, next) => {
    await Supplies.find(function (err, supplies) {
      if (err) {
        res.status(500).send("Error pulling supply requests");
      } else {
        res.json(supplies);
      }
    });
  });

  app.post("/api/supplies/add", ensureAuthenticated, async (req, res, next) => {
    const { requester, location, items } = req.body;
    let newSupplyRequest = new Supplies();
    newSupplyRequest.requester = requester;
    newSupplyRequest.items = items;

    const requesterLocation = await Location.findById(location);
    locationName = requesterLocation.name;

    let textNumber = keys.alerts.suppliesNumber;

    const msg = {
      to: textNumber,
      from: keys.alerts.fromEmail,
      subject: `Need supplies at ${locationName}`,
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

    await newSupplyRequest.save();
    res.json({ redirectURL: "/" });
  });
};
