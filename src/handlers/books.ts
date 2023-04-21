import { Request, Response } from 'express';
import * as db from '../db';

export const createBook = async (req: Request, res: Response) => {
  const { title, author, price } = req.body;

  // Input validation
  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Invalid title - enter a nonempty string' });
  }
  if (typeof author !== 'string' || !author.trim()) {
    return res.status(400).json({ error: 'Invalid author - enter a nonempty string' });
  }
  if (typeof price !== 'number' || isNaN(price) || price <= 0) {
    return res.status(400).json({ error: 'Invalid price - enter a positive real number' });
  }

  // Input sanitization
  const sanitizedTitle = title.trim().replace(/[^a-zA-Z0-9 ]/g, '');
  const sanitizedAuthor = author.trim().replace(/[^a-zA-Z0-9 ]/g, '');
  const sanitizedPrice = parseFloat(price.toFixed(2));

  await db.createBook(sanitizedTitle, sanitizedAuthor, sanitizedPrice);
  res.status(201).json({ status: 'success' });
};

export const getPrice = async (req: Request, res: Response) => {
  const { title, author } = req.body;

  // Input validation
  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Invalid title - enter a nonempty string' });
  }
  if (typeof author !== 'string' || !author.trim()) {
    return res.status(400).json({ error: 'Invalid author - enter a nonempty string' });
  }

  const bid = await db.getBookId(title.trim(), author.trim());

  if (!bid) {
    return res.status(404).json({ error: 'Book was not found' });
  }

  const price = await db.getBookPrice(bid);
  res.status(200).json({ price });
};
