module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/", (req, res) => {
    try {
      res.status(200).send({
        message: "Server Online !!!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: error,
      });
    }
  });
};
