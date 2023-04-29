const formRoute = require("./formInputs");
const likesDislikesRoute = require("./likesdislikes");
const commentsRoute = require("./comments");
const recommend = require("./recommendation")

const constructorMethod = (app) => {
  app.use("/", formRoute);
  app.use("/likes", likesDislikesRoute);
  app.use("/recommend", recommend)
  app.use("/comments", commentsRoute);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Page Not Found" });
  });
};

module.exports = constructorMethod;
