import type { ContactRequest, Order, CreateContactRequestInput, CreateOrderInput, UpdateOrderInput, UpdateContactInput, OrderFilter, ContactFilter } from "./types";
export declare function addContactRequest(input: CreateContactRequestInput): ContactRequest;
export declare function addOrder(input: CreateOrderInput): Order;
export declare function updateOrder(id: string, patch: UpdateOrderInput): Order | null;
export declare function updateContact(id: string, patch: UpdateContactInput): ContactRequest | null;
export declare function getOrder(id: string): Order | null;
export declare function getContact(id: string): ContactRequest | null;
export declare function listOrders(filter?: OrderFilter): Order[];
export declare function listContacts(filter?: ContactFilter): ContactRequest[];
