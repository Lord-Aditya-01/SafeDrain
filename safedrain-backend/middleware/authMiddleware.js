module.exports = (req, res, next) => {

  // example placeholder
  // later check JWT token or session

  const isAuth = true; // replace later

  if (!isAuth) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  next();
};
