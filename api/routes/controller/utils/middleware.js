const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/users/login");
  } else {
    next();
  }
};

const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect("/home");
  } else {
    next();
  }
};


module.exports = {
  redirectLogin,
  redirectHome,
};
