import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
const STORE_DIR = join(process.cwd(), "packages/orders/store");
const CONTACTS_FILE = join(STORE_DIR, "contact_requests.json");
const ORDERS_FILE = join(STORE_DIR, "orders.json");
// Ensure store directory exists
if (!existsSync(STORE_DIR)) {
    mkdirSync(STORE_DIR, { recursive: true });
}
// Initialize empty files if they don't exist
if (!existsSync(CONTACTS_FILE)) {
    writeFileSync(CONTACTS_FILE, JSON.stringify([], null, 2));
}
if (!existsSync(ORDERS_FILE)) {
    writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}
function readContacts() {
    try {
        const content = readFileSync(CONTACTS_FILE, "utf-8");
        return JSON.parse(content);
    }
    catch {
        return [];
    }
}
function writeContacts(contacts) {
    writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
}
function readOrders() {
    try {
        const content = readFileSync(ORDERS_FILE, "utf-8");
        return JSON.parse(content);
    }
    catch {
        return [];
    }
}
function writeOrders(orders) {
    writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}
export function addContactRequest(input) {
    const contacts = readContacts();
    const contact = {
        id: randomUUID(),
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
export function addOrder(input) {
    const orders = readOrders();
    const order = {
        id: randomUUID(),
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
export function updateOrder(id, patch) {
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
export function updateContact(id, patch) {
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
export function getOrder(id) {
    const orders = readOrders();
    return orders.find((o) => o.id === id) ?? null;
}
export function getContact(id) {
    const contacts = readContacts();
    return contacts.find((c) => c.id === id) ?? null;
}
export function listOrders(filter) {
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
export function listContacts(filter) {
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
