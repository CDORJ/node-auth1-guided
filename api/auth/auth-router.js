const bcrypt = require("bcrypt");
const server = require("../server");
const router = require("express").Router();
const Users = require("../users/users-model");

router.post("/register", (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body);

  const passwordHash = bcrypt.hashSync(password, 8);

  Users.add({ username, password: passwordHash })
    .then(({ id, username }) => res.json({ id, username }))
    .catch(next());
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome back, ${user.username}` });
      } else {
        res.status(401).json({ message: `Invalid credentials` });
      }
    })
    .catch(next());
});

module.exports = router;
