import { Request, Response } from 'express';
import * as db from '../db';

export const createCustomer = async (req: Request, res: Response) => {
  const { name, shippingAddress } = req.body;
  
  // Input validation
  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Invalid name - enter a nonempty string' });
  }
  if (typeof shippingAddress !== 'string' || !shippingAddress.trim()) {
    return res.status(400).json({ error: 'Invalid shipping address - enter a nonempty string' });
  }

  await db.createCustomer(name, shippingAddress);
  res.status(201).json({ 'status': 'success' });
}

export const updateCustomerAddress = async (req: Request, res: Response) => {
  try {
    const { cid, address } = req.body;
    
    // Input validation
    if (!Number.isInteger(cid) || cid <= 0) {
      return res.status(400).json({ error: 'Invalid customer ID - enter a positive integer' });
    }
    if (typeof address !== 'string' || !address.trim()) {
      return res.status(400).json({ error: 'Invalid address - enter a nonempty string' });
    }

    await db.updateCustomerAddress(cid, address);
    res.status(200).json({ status: "success" });
  } 
  catch (err) {
    res.status(404).send("The customer cannot be found");
  }
};

export const getCustomerBalance = async (req: Request, res: Response) => {
  try {
    const { cid } = req.body;
    
    // Input validation
    if (!Number.isInteger(cid) || cid <= 0) {
      return res.status(400).json({ error: 'Invalid customer ID - Enter a positive integer' });
    }

    const balance = await db.customerBalance(cid);
    res.status(200).json({ balance });
  } 
  catch (err) {
    res.status(404).send("The customer cannot be found");
  }
};
