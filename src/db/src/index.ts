import express, { Express } from "express";
import * as handlers from "./handlers";
import bodyParser from "body-parser";
import { appendFileSync } from "fs";

//log implementation
import * as fs from 'fs';

export const log = (message: string) => {
    fs.appendFileSync('log.txt', `${new Date().toUTCString()}: ${message}\n`);
  };

const app: Express = express();
const port = 8080;

app.use(bodyParser.json());

app.post("/books/new", (req, res) => {
  handlers.createBook(req, res);
  log("A new book was created.")
});

app.post("/customers/new", (req, res) => {
  handlers.createCustomer(req, res);
  log("A new customer was created.");
});

app.post("/orders/new", (req, res) => {
  handlers.createOrder(req, res);
  log("An order was created.");
});

app.put("/orders/ship", (req, res) => {
  handlers.shipOrder(req, res);
  log("An order was shipped.");
});

app.get("/books/price", (req, res) => {
  handlers.getPrice(req, res);
  log("A book price was recalled.");
});

app.get("/customers/balance", (req, res) => {
  handlers.getCustomerBalance(req, res);
 log("A customer balance was recalled.");
});

app.get("/orders/status", (req, res) => {
  handlers.getOrderStatus(req, res);
  log("An order status was recalled.");
});

app.get("/orders/shipped", (req, res) => {
  handlers.getShipmentStatus(req, res);
  log("A shipment status was checked.");
});


app.put("/customers/address", (req, res) => {
  handlers.updateCustomerAddress(req, res);
  log("A customer address was updated.");
});


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
