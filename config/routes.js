const express = require("express");

const router = express.Router();

// Controllers
const admin = new (require("../app/controllers/admin"))();
const auth = new (require("../app/controllers/auth"))();
const pages = new (require("../app/controllers/pages"))();

// adding a second action in this route that will be called with
// `next()` method that is in `pages.welcome` method
router.get("/", pages.welcome, admin.dashboard);

router.get("/login", auth.login);
router.get("/register", auth.register);

module.exports = router;
