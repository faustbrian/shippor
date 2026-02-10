# Shippor Parity Checklist

Use this checklist to track strict structural parity between `react-shipping-tool` and `shippor`.

## Status Legend
- `Not Started`
- `In Progress`
- `Blocked`
- `Done`

## 1. Authentication
| Web Feature | Mobile Screen/Flow | Status | Exact Match? | Notes |
|---|---|---|---|---|
| Login | Auth -> Login | In Progress | No | |
| Register | Auth -> Register | In Progress | No | |
| Forgot password | Auth -> Forgot | In Progress | No | |
| Reset password | Auth -> Reset | In Progress | No | |

## 2. Send Flow: Step 1 / Basic
| Web Feature | Mobile Screen/Flow | Status | Exact Match? | Notes |
|---|---|---|---|---|
| Sender/recipient type and basic setup | SendBasic | In Progress | No | |
| Address quick search behavior | SendBasic / SendQuickStart | In Progress | No | |
| Address book selection behavior | SendBasic | In Progress | No | |
| Parcel setup fields/order | SendBasic | In Progress | No | |
| Step gating and validation mapping | SendBasic | In Progress | No | |

## 3. Send Flow: Step 2 / Address Details
| Web Feature | Mobile Screen/Flow | Status | Exact Match? | Notes |
|---|---|---|---|---|
| Full address field order and visibility | SendAddressDetails / SendQuickAddressDetails | In Progress | No | |
| Country-specific conditional requiredness | Address details | In Progress | No | |
| Phone input country-aware behavior | Address details | In Progress | No | |
| VAT/EORI/SSN/EIN conditional logic | Address details | In Progress | No | |
| Payer relation / third-party billing behavior | Address details | In Progress | No | |
| Address correction acceptance flow | Address details | Not Started | No | |

## 4. Send Flow: Step 3 / Shipment Details
| Web Feature | Mobile Screen/Flow | Status | Exact Match? | Notes |
|---|---|---|---|---|
| Shipment details fields and requiredness | SendShipmentDetails / SendQuickShipmentDetails | In Progress | No | |
| Commercial/proforma mode behavior | Shipment details | In Progress | No | |
| Power mode full structure and dependencies | Shipment details | In Progress | No | |
| Item selection / quick-add behavior | Shipment details | In Progress | No | |
| Additional services visibility matrix | Shipment details | In Progress | No | |
| COD + dangerous goods rule parity | Shipment details | In Progress | No | |

## 5. Send Flow: Step 4 / Methods
| Web Feature | Mobile Screen/Flow | Status | Exact Match? | Notes |
|---|---|---|---|---|
| Methods fetch + loading states | SendMethods | In Progress | No | |
| Method list item composition | SendMethods | In Progress | No | |
| Sort/filter parity | SendMethods | In Progress | No | |
| Pickup point selection behavior | SendMethods | In Progress | No | |
| Method validation + step gating | SendMethods | In Progress | No | |

## 6. Send Flow: Cart + Payment
| Web Feature | Mobile Screen/Flow | Status | Exact Match? | Notes |
|---|---|---|---|---|
| Cart controller state machine | SendCart | In Progress | No | |
| Cart item-level error mapping and retry | SendCart | In Progress | No | |
| Payment selection + gateway behavior | SendPayment | In Progress | No | |
| Terms handling + submission gates | SendPayment | In Progress | No | |
| Redirect/return flow handling | Cart/Payment | Not Started | No | |

## 7. Send Flow: Thank You
| Web Feature | Mobile Screen/Flow | Status | Exact Match? | Notes |
|---|---|---|---|---|
| Metadata-driven documents composition | SendThankYou / SendQuickThankYou | In Progress | No | |
| Loading/error handling parity | Thank you | In Progress | No | |
| Multi-shipment rendering parity | Thank you | In Progress | No | |
| New shipment creation/redirect behavior | Thank you | In Progress | No | |

## 8. Tracking / Shipments / Home / Settings
| Web/Requested Feature | Mobile Screen/Flow | Status | Exact Match? | Notes |
|---|---|---|---|---|
| Shipment tracking by number | Track | In Progress | No | |
| User shipment list/history | Shipments | In Progress | No | |
| Home balance + pending/out-for-delivery/delivered | Home | In Progress | No | |
| Settings and account basics | Settings | In Progress | No | |

## 9. Data + API Contract Parity
| Feature | Status | Exact Match? | Notes |
|---|---|---|---|
| Payload shape parity with web API contracts | Not Started | No | |
| Response/error contract parity | Not Started | No | |
| Server validation error mapping parity | Not Started | No | |
| Document metadata endpoint parity | In Progress | No | |

## 10. Final Sign-Off Checks
- [ ] Every row above marked `Done`.
- [ ] Every `Exact Match?` marked `Yes`.
- [ ] Manual QA run completed for all send flows (basic + quick).
- [ ] Unregistered/registered paths both verified.
- [ ] International + domestic scenarios verified.
