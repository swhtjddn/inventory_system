module.exports = (app, Location, ensureAuthenticated) => {
  app.get("/api/locations", ensureAuthenticated, async (req, res, next) => {
    await Location.find((err, locations) => {
      if (err) {
        res.status(500).send("Error pulling locations");
      } else {
        res.json(locations);
      }
    });
  });

  app.post("/api/locations/add", async (req, res) => {
    const { name } = req.body;
    const existingLocation = await Location.findOne({ name: name });
    if (existingLocation) {
      return res.status(400).send("That location already exists!");
    } else {
      let newLocation = new Location();
      newLocation.name = name;

      await newLocation.save();
      res.json({ redirectURL: "/" });
    }
  });

  app.delete(
    "/api/locations/:id",
    ensureAuthenticated,
    async (req, res, next) => {
      await Location.findByIdAndDelete(req.params.id, (err, location) => {
        if (err) {
          console.log(err);
        } else {
          res.json(location);
        }
      });
    }
  );
};
