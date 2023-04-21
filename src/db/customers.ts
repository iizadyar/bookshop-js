import { connect } from './db';

export const createCustomer = async (name: string, address: string): Promise<number> => {
    const db = await connect();
    await db.run(`INSERT INTO Customers (name, shippingAddress) VALUES (?, ?)`, [name, address]);
    return getCustomerId(name, address);
}

export const getCustomerId = async (name: string, address: string): Promise<number> => {
    const db = await connect();
    const result = await db.get(`SELECT id FROM Customers WHERE name = ? AND shippingAddress = ?`, [name, address]);
    return result.id;
}

export const getCustomerAddress = async (cid: number): Promise<string> => {
    const db = await connect();
    const result = await db.get(`SELECT shippingAddress FROM Customers WHERE id = ?`, [cid]);
    return result.shippingAddress;
}

export const updateCustomerAddress = async (cid: number, address: string): Promise<void> => {
    const db = await connect();
    await db.run(`UPDATE Customers SET shippingAddress = ? WHERE id = ?`, [address, cid]);
}

export const customerBalance = async (cid: number): Promise<number> => {
    const db = await connect();
    const result = await db.get(`SELECT accountBalance FROM Customers WHERE id = ?`, [cid]);
    return result.accountBalance;
}

export const chargeCustomerForPO = async (pid: number) => {
    // todo
    return;
}