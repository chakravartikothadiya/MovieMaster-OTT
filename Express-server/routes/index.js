const formRoute = require("./formInputs");

const constructorMethod = (app) => {
  app.use("/", formRoute);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Page Not Found" });
  });
};

module.exports = constructorMethod;
