const { response } = require("express");

module.exports = (app, Item, ensureAuthenticated) => {
  app.get("/api/inventory", ensureAuthenticated, async (req, res, next) => {
    await Item.find(function (err, inventory) {
      if (err) {
        res.status(500).send("Error pulling Inventory");
        console.log(err);
      } else {
        res.json(inventory);
      }
    });
  });

  app.get("/api/inventory/:id", ensureAuthenticated, async (req, res, next) => {
    await Item.findById(req.params.id, (err, item) => {
      if (err) {
        console.log(err);
      } else {
        res.json(item);
      }
    });
  });

  app.post(
    "/api/inventory/add",
    ensureAuthenticated,
    async (req, res, next) => {
      const { name, description, quantity } = req.body;
      const existingItem = await Item.findOne({ name: name });
      if (existingItem) {
        return res.status(400).send("That item already exists!");
      } else {
        let newItem = new Item();
        newItem.name = name;
        newItem.description = description;
        if (newItem.quantity < 0) {
          return res
            .status(400)
            .send("Inventory quantity cannot be less than 0");
        }
        newItem.quantity = quantity;

        await newItem.save();
        res.json({ redirectURL: "/app/inventory" });
      }
    }
  );

  app.patch(
    "/api/inventory/shipment",
    ensureAuthenticated,
    async (req, res, next) => {
      const filtered = req.body.filter((item) => item.value > 0);
      console.log(filtered);

      filtered.forEach(async (item) => {
        await Item.updateOne(
          { _id: item._id },
          { $inc: { quantity: item.value } }
        );
      });
    }
  );

  app.patch(
    "/api/inventory/:id",
    ensureAuthenticated,
    async (req, res, next) => {
      await Item.updateOne(
        { _id: req.params.id },
        {
          $set: {
            name: req.body.name,
            description: req.body.description,
            quantity: req.body.quantity,
          },
        },
        (err, item) => {
          if (err) {
            res.status(500).send("Error changing request");
          } else {
            res.json({ redirectURL: "/app/inventory" });
          }
        }
      );
    }
  );

  app.delete(
    "/api/inventory/:id",
    ensureAuthenticated,
    async (req, res, next) => {
      await Item.findByIdAndDelete(req.params.id, (err, item) => {
        if (err) {
          console.log(err);
        } else {
          res.json(item);
        }
      });
    }
  );
};
