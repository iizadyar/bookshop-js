import { Request, Response } from "express";
import * as db from "../db";

export const createOrder = async (req: Request, res: Response) => {
  const { title, author, name, shippingAddress } = req.body;
  const bid = await db.getBookId(title, author);
  const cid = await db.getCustomerId(name, shippingAddress);
  await db.createPurchaseOrder(bid, cid);
  res.status(201).json({ status: 'success' });
}

export const getShipmentStatus = async (req: Request, res: Response) => {
  try {
    const { title, author, name, shippingAddress } = req.body;
    const bid = await db.getBookId(title, author);
    const cid = await db.getCustomerId(name, shippingAddress);
    const pid = await db.getPOIdByContents(bid, cid);
    const shipped = await db.isPoShipped(pid);
    res.status(200).json({ shipped });
  } catch (err) {
    res.status(404).send("The order was not found");
  }
};

export const shipOrder = async (req: Request, res: Response) => {
  try {
    const { pid } = req.body;
    await db.shipPo(pid);
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(404).send("The order was not found");
  }
};

export const getOrderStatus = async (req: Request, res: Response) => {
  try {
    const { cid, bid } = req.body;
    const pid = await db.getPOIdByContents(bid, cid);
    const shipped = await db.isPoShipped(pid);
    const addr = await db.getCustomerAddress(cid);
    res.set("Content-Type", "text/html");
    res.status(200);
    res.send(
      Buffer.from(`
      <html>
      <head>
      <title>Order Status</title>
      </head>
      <body>
          <h1>Order Status</h1>
          <p>Order ID: ${pid}</p>
          <p>Book ID: ${bid}</p>
          <p>Customer ID: ${cid}</p>
          <p>Is Shipped: ${shipped}</p>
          <p>Shipping Address: ${addr}</p>
      </body>
      </html>
      `)
    );
  } catch (err) {
    res.status(404).send("The order was not found");
  }
};
