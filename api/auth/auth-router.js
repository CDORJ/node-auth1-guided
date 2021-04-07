const router = require("express").Router();
const Users = require("../users/users-model.js");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res, next) => {
  try {
    const newUser = req.body;
    const hash = bcrypt.hashSync(newUser.password, 10);
    newUser.password = hash;
    const saved = await Users.add(newUser);
    res.status(200).json(saved);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    let { username, password } = req.body;
    const user = await Users.findBy({ username }).first();
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.status(200).json({ message: `welcome ${user.username}` });
    } else {
      res.status(401).json({ message: "invalid creds" });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/logout", async (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.send("You can checkout anytime you like...");
      } else {
        res.send("so long and thanks for all the fish...");
      }
    });
  } else {
    res.end();
  }
});

module.exports = router;
