# Payment Integration Requirements (Uzbekistan Gateways)

To enable real payments in NEURYNTH, the backend must implement the following integrations.

## 1. Gateway Options

### Payme Business
- **Integration**: Direct API (Merchant API) or Redirect (Checkout).
- **Requirements**: Merchant ID, Secret Key.
- **Backend Task**: Generate regular/subscription receipts. Implement `payme-callback` for state synchronization (CheckPerformTransaction, CreateTransaction, PerformTransaction, CancelTransaction).

### Click Business
- **Integration**: Click API.
- **Requirements**: Service ID, Merchant ID, Secret Key.
- **Backend Task**: Create invoice via API. Handle Click callbacks for payment confirmation.

### Uzcard / Humo (via Payment Aggregator)
- **Aggregators**: Pay Way, Octo, MyUzcard.
- **Benefits**: Single integration for both local card types.
- **Backend Task**: Follow aggregator documentation to create orders and handle webhooks.

## 2. Security Requirements
- **PCI DSS**: Ensure card data is never stored on your own server. Use tokens or direct gateway redirects.
- **HTTPS**: Backend must serve over HTTPS for any payment callbacks.
- **IP White-listing**: Only allow callbacks from official Gateway IP ranges.

## 3. Implementation Steps for Developer
1. **Choose Aggregator**: (e.g., Payme + Click + Octo for cards).
2. **Setup Callbacks**: Create endpoints like `/api/payments/payme/callback`.
3. **Update Order State**: When a callback is successful, update the order status in `orders.json` (or database) from `Pending` to `Paid`.
4. **Notify Frontend**: The frontend currently waits/polls for status. Implement WebSockets or simple status polling.
