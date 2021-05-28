const { Router } = require("express");
const router = new Router();

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("./assets/data/database.json");
const db = low(adapter);
const { generateOrderNr, generateETA } = require("../utils/utils");
const { v4: uuidv4 } = require("uuid");

router.post("/", (req, res) => {
  const orderInfo = { ...req.body, orderNr: generateOrderNr() };
  console.log(orderInfo);
  const orders = db.get("orders");
  const totalPrice = orderInfo.cart
    .map((p) => p.price)
    .reduce((total, pizzaPrice) => total + pizzaPrice);
  const [date, time] = new Date().toISOString().split("T");
  const orderRes = {
    date: date,
    time: time,
    total: totalPrice,
    eta: generateETA(),
    ...orderInfo,
  };
  orders.push(orderRes).write();
  setTimeout(() => {
    res.send(orderRes);
  }, 2000);
});

router.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  const orders = db.get("orders");
  const userOrders = orders.filter({ userId }).value();
  res.send(userOrders);
});

// router.get("/key", (req, res) => {
//   const key = uuidv4(); //uuidv4();
//   res.send(key);
// });

module.exports = router;
