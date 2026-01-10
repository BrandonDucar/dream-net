"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContactRequest = addContactRequest;
exports.addOrder = addOrder;
exports.updateOrder = updateOrder;
exports.updateContact = updateContact;
exports.getOrder = getOrder;
exports.getContact = getContact;
exports.listOrders = listOrders;
exports.listContacts = listContacts;
const node_crypto_1 = require("node:crypto");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const STORE_DIR = (0, node_path_1.join)(process.cwd(), "packages/orders/store");
const CONTACTS_FILE = (0, node_path_1.join)(STORE_DIR, "contact_requests.json");
const ORDERS_FILE = (0, node_path_1.join)(STORE_DIR, "orders.json");
// Ensure store directory exists
if (!(0, node_fs_1.existsSync)(STORE_DIR)) {
    (0, node_fs_1.mkdirSync)(STORE_DIR, { recursive: true });
}
// Initialize empty files if they don't exist
if (!(0, node_fs_1.existsSync)(CONTACTS_FILE)) {
    (0, node_fs_1.writeFileSync)(CONTACTS_FILE, JSON.stringify([], null, 2));
}
if (!(0, node_fs_1.existsSync)(ORDERS_FILE)) {
    (0, node_fs_1.writeFileSync)(ORDERS_FILE, JSON.stringify([], null, 2));
}
function readContacts() {
    try {
        const content = (0, node_fs_1.readFileSync)(CONTACTS_FILE, "utf-8");
        return JSON.parse(content);
    }
    catch {
        return [];
    }
}
function writeContacts(contacts) {
    (0, node_fs_1.writeFileSync)(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
}
function readOrders() {
    try {
        const content = (0, node_fs_1.readFileSync)(ORDERS_FILE, "utf-8");
        return JSON.parse(content);
    }
    catch {
        return [];
    }
}
function writeOrders(orders) {
    (0, node_fs_1.writeFileSync)(ORDERS_FILE, JSON.stringify(orders, null, 2));
}
function addContactRequest(input) {
    const contacts = readContacts();
    const contact = {
        id: (0, node_crypto_1.randomUUID)(),
        createdAt: new Date().toISOString(),
        name: input.name,
        email: input.email,
        channel: input.channel,
        message: input.message,
        category: input.category,
        tags: input.tags ?? [],
        status: "new",
    };
    contacts.push(contact);
    writeContacts(contacts);
    return contact;
}
function addOrder(input) {
    const orders = readOrders();
    const order = {
        id: (0, node_crypto_1.randomUUID)(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        itemName: input.itemName,
        sku: input.sku,
        quantity: input.quantity,
        currency: input.currency,
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        paymentStatus: "unpaid",
        customerEmail: input.customerEmail,
        notes: input.notes,
        meta: input.meta ?? {},
        status: "open",
    };
    orders.push(order);
    writeOrders(orders);
    return order;
}
function updateOrder(id, patch) {
    const orders = readOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1)
        return null;
    const updated = {
        ...orders[index],
        ...patch,
        updatedAt: new Date().toISOString(),
    };
    orders[index] = updated;
    writeOrders(orders);
    return updated;
}
function updateContact(id, patch) {
    const contacts = readContacts();
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1)
        return null;
    const updated = {
        ...contacts[index],
        ...patch,
    };
    contacts[index] = updated;
    writeContacts(contacts);
    return updated;
}
function getOrder(id) {
    const orders = readOrders();
    return orders.find((o) => o.id === id) ?? null;
}
function getContact(id) {
    const contacts = readContacts();
    return contacts.find((c) => c.id === id) ?? null;
}
function listOrders(filter) {
    let orders = readOrders();
    if (filter) {
        if (filter.status) {
            orders = orders.filter((o) => o.status === filter.status);
        }
        if (filter.paymentStatus) {
            orders = orders.filter((o) => o.paymentStatus === filter.paymentStatus);
        }
        if (filter.currency) {
            orders = orders.filter((o) => o.currency === filter.currency);
        }
        if (filter.paymentMethod) {
            orders = orders.filter((o) => o.paymentMethod === filter.paymentMethod);
        }
    }
    // Sort by createdAt descending (newest first)
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
function listContacts(filter) {
    let contacts = readContacts();
    if (filter) {
        if (filter.category) {
            contacts = contacts.filter((c) => c.category === filter.category);
        }
        if (filter.status) {
            contacts = contacts.filter((c) => c.status === filter.status);
        }
    }
    // Sort by createdAt descending (newest first)
    return contacts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
