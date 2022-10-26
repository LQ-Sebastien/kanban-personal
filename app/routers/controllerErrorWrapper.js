module.exports = function controllerErrorWrapper(middleware) {
  return async function (req, res, next) {
    try {
      await middleware(req, res, next);
    } catch(error) {
      console.error(error);
      res.status(500).json({ error: "Unexpected server error. Please try again later" });
    }
  };
};
