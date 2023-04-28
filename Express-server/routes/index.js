const formRoute = require("./formInputs");
const likesDislikesRoute = require("./likesdislikes");

const constructorMethod = (app) => {
  app.use("/", formRoute);
  app.use("/likes", likesDislikesRoute);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Page Not Found" });
  });
};

module.exports = constructorMethod;
