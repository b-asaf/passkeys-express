class PagesController {
  welcome(req, res, next) {
    if (!req.user) {
      return res.render("../views/pages/welcome.ejs");
    }

    next();
  }
}

module.exports = PagesController;
