import { connect } from './db'

export const createBook = async (title: string, author: string, price: number): Promise<number> => {
    const db = await connect();
    await db.run(`INSERT INTO Books (title, author, price) VALUES (?, ?, ?)`, [title, author, price]);
    return getBookId(title, author);
}

export const getBookId = async (title: string, author: string): Promise<number> => {
    const db = await connect();
    const result = await db.get(`SELECT id FROM Books WHERE title = ? AND author = ?`, [title, author]);
    return result.id;
}

export const getBookPrice = async (bid: number): Promise<number> => {
    const db = await connect();
    const result = await db.get(`SELECT price FROM Books WHERE id = ?`, [bid]);
    return result.price;
}