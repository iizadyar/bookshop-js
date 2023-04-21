import sqlite3 from "sqlite3";
import { existsSync } from "fs";
import { exit } from "process";
import { Database, open } from "sqlite";

const schema: string = `
CREATE TABLE Books (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    price REAL NOT NULL
);

CREATE TABLE Customers (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    shippingAddress TEXT NOT NULL,
    accountBalance REAL
);

-- SQLITE has no boolean type, 1 is true, 0 false
CREATE TABLE PurchaseOrders (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    bookId INTEGER NOT NULL REFERENCES Books(id),
    customerId INTEGER NOT NULL REFERENCES Customers(id),
    shipped INTEGER NOT NULL
);

INSERT INTO Books (title, author, price) VALUES ('The Hitchhikers Guide to the Galaxy', 'Douglas Adams', 12.99);
INSERT INTO Books (title, author, price) VALUES ('Dune', 'Frank Herbert', 9.99);
INSERT INTO Books (title, author, price) VALUES ('The Left Hand of Darkness', 'Ursula K. Le Guin', 8.99);
INSERT INTO Books (title, author, price) VALUES ('Foundation', 'Isaac Asimov', 7.99);
INSERT INTO Books (title, author, price) VALUES ('The Player of Games', 'Iain M. Banks', 6.99);
`

export const connect = async (): Promise<Database<sqlite3.Database, sqlite3.Statement>> => {
    try {
        let mustInitDb = false;
        if (!existsSync("dd.db")) {
            mustInitDb = true;
        }

        return await open({
            filename: "dd.db",
            driver: sqlite3.Database,
        }).then(async (db) => {
            if (mustInitDb) {
                await db.exec(schema);
            }
            return db
        }).then(async (db) => await db);

    } catch (error) {
        console.error(error)
        exit();
    }
}