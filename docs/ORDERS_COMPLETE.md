# Orders - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Orders provides **order and contact request management** for DreamNet. It handles order creation, payment tracking, contact request management, and provides filtering and querying capabilities for both orders and contact requests.

---

## Key Features

### Order Management
- Order creation
- Order updates
- Payment tracking
- Order status management
- Order filtering

### Contact Request Management
- Contact request creation
- Contact request updates
- Status tracking
- Category management
- Contact filtering

### Payment Support
- Multiple currencies (USD, ETH, USDC)
- Multiple payment methods (Stripe, crypto, manual)
- Payment status tracking
- Transaction ID tracking

---

## Architecture

### Components

1. **Orders Store** (`store.ts`)
   - File-based storage
   - Order CRUD operations
   - Contact request CRUD operations
   - Filtering and querying

2. **Orders Types** (`types.ts`)
   - Type definitions
   - Order interfaces
   - Contact request interfaces
   - Filter interfaces

---

## API Reference

### Order Operations

#### `addOrder(input: CreateOrderInput): Order`
Creates a new order.

**Example**:
```typescript
import { addOrder } from '@dreamnet/orders';

const order = addOrder({
  itemName: 'DreamNet Premium',
  sku: 'DN-PREM-001',
  quantity: 1,
  currency: 'USD',
  amount: 99.99,
  paymentMethod: 'stripe',
  customerEmail: 'customer@example.com',
  notes: 'Monthly subscription',
});

console.log(`Order created: ${order.id}`);
```

#### `updateOrder(id: string, patch: UpdateOrderInput): Order | null`
Updates an order.

**Example**:
```typescript
import { updateOrder } from '@dreamnet/orders';

const updated = updateOrder('order-id', {
  status: 'fulfilled',
  paymentStatus: 'paid',
  txId: '0x123...',
});

if (updated) {
  console.log(`Order updated: ${updated.id}`);
}
```

#### `getOrder(id: string): Order | null`
Gets an order by ID.

**Example**:
```typescript
import { getOrder } from '@dreamnet/orders';

const order = getOrder('order-id');
if (order) {
  console.log(`Order: ${order.itemName}`);
  console.log(`Status: ${order.status}`);
  console.log(`Payment: ${order.paymentStatus}`);
}
```

#### `listOrders(filter?: OrderFilter): Order[]`
Lists orders with optional filtering.

**Example**:
```typescript
import { listOrders } from '@dreamnet/orders';

// Get all unpaid orders
const unpaidOrders = listOrders({ paymentStatus: 'unpaid' });

// Get all USD orders
const usdOrders = listOrders({ currency: 'USD' });

// Get all fulfilled orders
const fulfilledOrders = listOrders({ status: 'fulfilled' });
```

### Contact Request Operations

#### `addContactRequest(input: CreateContactRequestInput): ContactRequest`
Creates a new contact request.

**Example**:
```typescript
import { addContactRequest } from '@dreamnet/orders';

const contact = addContactRequest({
  name: 'John Doe',
  email: 'john@example.com',
  channel: 'website',
  message: 'Interested in DreamNet services',
  category: 'custom',
  tags: ['inquiry', 'sales'],
});

console.log(`Contact request created: ${contact.id}`);
```

#### `updateContact(id: string, patch: UpdateContactInput): ContactRequest | null`
Updates a contact request.

**Example**:
```typescript
import { updateContact } from '@dreamnet/orders';

const updated = updateContact('contact-id', {
  status: 'replied',
  tags: ['inquiry', 'sales', 'replied'],
});

if (updated) {
  console.log(`Contact updated: ${updated.id}`);
}
```

#### `getContact(id: string): ContactRequest | null`
Gets a contact request by ID.

**Example**:
```typescript
import { getContact } from '@dreamnet/orders';

const contact = getContact('contact-id');
if (contact) {
  console.log(`Contact: ${contact.name}`);
  console.log(`Status: ${contact.status}`);
}
```

#### `listContacts(filter?: ContactFilter): ContactRequest[]`
Lists contact requests with optional filtering.

**Example**:
```typescript
import { listContacts } from '@dreamnet/orders';

// Get all new contacts
const newContacts = listContacts({ status: 'new' });

// Get all collectibles category contacts
const collectiblesContacts = listContacts({ category: 'collectibles' });
```

---

## Data Models

### Order

```typescript
interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  itemName: string;
  sku?: string;
  quantity: number;
  currency: OrderCurrency;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  txId?: string;
  stripeSessionId?: string;
  customerEmail?: string;
  notes?: string;
  meta?: Record<string, unknown>;
  status: OrderStatus;
}
```

### ContactRequest

```typescript
interface ContactRequest {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  channel?: string;
  message: string;
  category: ContactCategory;
  tags?: string[];
  status: ContactStatus;
}
```

### OrderCurrency

```typescript
type OrderCurrency = "USD" | "ETH" | "USDC";
```

### PaymentMethod

```typescript
type PaymentMethod = "stripe" | "crypto" | "manual";
```

### PaymentStatus

```typescript
type PaymentStatus = "unpaid" | "pending" | "paid" | "failed" | "refunded";
```

### OrderStatus

```typescript
type OrderStatus = "open" | "sourcing" | "awaiting-payment" | "fulfilled" | "canceled";
```

### ContactCategory

```typescript
type ContactCategory = "collectibles" | "metals" | "custom" | "media";
```

### ContactStatus

```typescript
type ContactStatus = "new" | "review" | "replied" | "closed";
```

---

## Storage

### File-Based Storage
- Orders stored in `packages/orders/store/orders.json`
- Contact requests stored in `packages/orders/store/contact_requests.json`
- JSON format with pretty printing
- Automatic file creation

### Data Persistence
- Automatic file creation
- Error handling for file operations
- Atomic writes
- JSON serialization

---

## Integration Points

### DreamNet Systems
- **Dream Shop**: Order integration
- **Economic Engine Core**: Payment processing
- **DreamNet Audit Core**: Order audit logging
- **Social Hub Core**: Contact request notifications

### External Systems
- **Stripe**: Payment processing
- **Crypto Wallets**: Crypto payments
- **Email Systems**: Contact notifications

---

## Usage Examples

### Create Order

```typescript
const order = addOrder({
  itemName: 'DreamNet Premium',
  quantity: 1,
  currency: 'USD',
  amount: 99.99,
  paymentMethod: 'stripe',
});
```

### Update Order Payment

```typescript
updateOrder(order.id, {
  paymentStatus: 'paid',
  stripeSessionId: 'cs_123...',
});
```

### Filter Orders

```typescript
const unpaidOrders = listOrders({ paymentStatus: 'unpaid' });
const cryptoOrders = listOrders({ paymentMethod: 'crypto' });
```

### Create Contact Request

```typescript
const contact = addContactRequest({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Interested in services',
  category: 'custom',
});
```

---

## Best Practices

1. **Order Management**
   - Track payment status
   - Update order status appropriately
   - Store transaction IDs
   - Handle refunds

2. **Contact Management**
   - Categorize contacts
   - Track status
   - Use tags for organization
   - Follow up on contacts

---

## Security Considerations

1. **Data Security**
   - Protect customer emails
   - Secure payment information
   - Validate inputs
   - Audit order changes

2. **Payment Security**
   - Validate payment status
   - Verify transaction IDs
   - Handle payment failures
   - Secure Stripe sessions

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

