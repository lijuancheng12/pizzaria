const { Router } = require("express");
const router = new Router();

const db = require("../utils/db");

const { v4: uuidv4 } = require("uuid");

router.post("/", (req, res) => {
  const userInfo = req.body;
  const users = db.get("users");
  const existingUser = users.find({ email: userInfo.email }).value();
  if (existingUser) {
    res.send({ error: "User exist" });
  } else {
    const newUser = {
      ...userInfo,
      id: uuidv4(),
    };
    users.push(newUser).write();
    res.send(newUser);
  }
});

router.post("/update", (req, res) => {
  const userInfo = req.body;
  const users = db.get("users");
  const existingUser = users.find({ id: userInfo.id });
  existingUser.assign({ ...existingUser.value(), ...userInfo }).write();
  res.send(userInfo);
});

router.post("/logIn", (req, res) => {
  const userInfo = req.body;
  const users = db.get("users");
  const existingUser = users.find({ email: userInfo.email }).value();
  if (existingUser) {
    if (existingUser.password === userInfo.password) {
      res.send(existingUser);
    } else {
      res.send({ error: "Wrong password" });
    }
  } else {
    res.send({ error: "No user" });
  }
});

router.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  const users = db.get("users");
  const user = users.find({ id: userId }).value();
  res.send(user);
});

module.exports = router;
