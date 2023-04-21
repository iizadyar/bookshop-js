import { chargeCustomerForPO } from "./customers";
import { connect } from "./db";

export const createPurchaseOrder = async (bid: number, cid: number): Promise<number> => {
    const db = await connect();
    await db.run(`INSERT INTO PurchaseOrders (bookId, customerId, shipped) VALUES (?, ?, ?)`, [bid, cid, 0]);
    return getPOIdByContents(bid, cid);
}

export const getPOIdByContents = async (bid: number, cid: number): Promise<number> => {
    const db = await connect();
    const result = await db.get(`SELECT id FROM PurchaseOrders WHERE bookId = ? AND customerId = ?`, [bid, cid]);
    return result.id;
}

export const isPoShipped = async (pid: number): Promise<boolean> => {
    const db = await connect();
    const result = await db.get(`SELECT shipped FROM PurchaseOrders WHERE id = ?`, [pid]);
    return result.shipped === 1;
}

export const shipPo = async (pid: number): Promise<void> => {
    const db = await connect();
    await chargeCustomerForPO(pid);
    await db.run(`UPDATE PurchaseOrders SET shipped = 1 WHERE id = ?`, [pid]);
}