class AdminController {
  dashboard(req, res, next) {
    return res.render("/admin/dashboard", { user: req.user });
  }
}

module.exports = AdminController;
