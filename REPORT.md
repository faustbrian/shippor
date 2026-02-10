# Shippor Remaining Work Report

This document lists the remaining work needed to move `shippor` from UI-heavy MVP to full functional parity with `react-shipping-tool` and production readiness.

## 1. Functional Parity Gaps (React Shipping Tool -> Shippor)

### 1.1 Shipping flow parity
- Replicate full `react-shipping-tool` state machine behavior for:
  - step transitions
  - guard conditions
  - route recovery behavior
  - draft/cart persistence and restore flows
- Mirror all dynamic section visibility rules exactly (not approximated) across:
  - sender type (private/business)
  - recipient type
  - business entity
  - country-specific rules
  - selected shipping method constraints
  - registered vs unregistered user behavior

### 1.2 Address details parity
- Replicate complete `AddressFields` logic from web including:
  - all `isAddressFieldRequired` branches
  - full VAT/tax ID behavior by country and service
  - SSN/EIN rules (US/KR/SE and payer combinations)
  - payer relation + third-party billing nuances
  - address validation acceptance/correction flows
- Match web behavior for postal/street/country restrictions (editable/read-only cases by step).

### 1.3 Shipment details parity
- Fully replicate `CommercialAndProformaInvoice` behavior:
  - mandatory/proforma branching
  - language warnings
  - quick-add behavior and settings integration
- Fully replicate `ShippingToolCommercialInvoicePowerMode`:
  - every section, field, and field dependency
  - auto-sync behavior between shipment/address/proforma values
  - item-level calculations and error display mapping
- Replicate dangerous goods and COD behavior exactly, including field requirements and visibility triggers.

### 1.4 Methods step parity
- Match `ShippingMethodSelectionListItem` structure and interactions 1:1:
  - full tag composition
  - all info blocks and expanded sections
  - loading placeholders and fetch states
  - pickup point selection behavior and edge cases
- Align sorting/filtering defaults and fallback behavior exactly.

### 1.5 Cart and checkout parity
- Implement full `CartPaymentAndShipmentController` orchestration:
  - proper cart state machine transitions
  - mutation-level error mapping per cart item
  - retry semantics
  - payment gateway redirect flow and return handling
  - post-payment reconciliation with cart status API

### 1.6 Thank-you parity
- Implement full metadata-driven `ThankYouPage` behavior:
  - document fetch by cart/shipment metadata
  - loading/error state handling parity
  - exact multi-shipment document composition
  - new shipment creation/redirect behavior parity

## 2. Backend Replication and Integration

### 2.1 API contract parity
- Replicate all web API contracts used by `react-shipping-tool`:
  - request payload shapes
  - response schemas
  - status/error semantics
  - authentication/authorization expectations
- Replace all mock APIs with real service integrations.

### 2.2 Backend endpoints/services
- Implement/validate backend support for:
  - auth (login/register/forgot/reset)
  - address book CRUD/search
  - shipment draft lifecycle
  - shipping methods fetching
  - pickup locations
  - cart status/update/send shipment
  - payment gateway session + callback
  - documents retrieval (labels/receipts/invoices)
  - tracking history and tracking lookup

### 2.3 Data persistence
- Replace in-memory client state assumptions with durable backend persistence:
  - drafts
  - cart state
  - checkout state
  - failed/retry metadata
  - document metadata

## 3. Validation and Business Rules Completion

### 3.1 Validation parity
- Port all web validation rules into mobile domain layer, including:
  - step 1/basic validations
  - full address validations
  - shipment details validations
  - shipping method validations
  - cart/checkout validations
- Ensure error messages and field mapping align with backend and web.

### 3.2 Country/business-entity rules
- Port all country meta + entity-specific rule logic from web:
  - EORI requirements
  - VAT requirements
  - special territory logic
  - customs value/type requirements
  - method-specific field requirements

## 4. Error Handling and Resilience

### 4.1 API error handling
- Implement standardized error normalization layer:
  - server validation errors -> field errors
  - business errors -> screen/banner errors
  - transport errors -> retryable states
- Add recoverable states and retry controls for all network critical paths.

### 4.2 Offline and flaky network handling
- Add robust loading/error/timeout UX and retry policy for:
  - methods
  - cart submit
  - payment status
  - documents
  - tracking

### 4.3 Crash and exception handling
- Add global error boundaries/reporting strategy.
- Add production logging/telemetry hooks for checkout-critical paths.

## 5. Testing Work (Currently Deferred)

### 5.1 Unit tests
- Domain rules:
  - address visibility/requiredness
  - shipment validation
  - additional services logic
  - VAT/country rules
- Utility tests:
  - phone parsing/normalization
  - quick search matching/safety

### 5.2 Integration tests
- Step-by-step send flow (basic + quick)
- Methods selection + pickup flow
- Cart + payment transitions
- Thank-you document loading
- Error/retry paths

### 5.3 E2E tests
- Auth + send shipment full path
- Guest/unregistered path
- International shipment with proforma/power mode
- Failed payment + retry + successful completion

## 6. Security and Compliance

- Token/session handling hardening (secure storage + refresh).
- Input sanitization and payload validation across all form boundaries.
- PII handling review (phone/email/tax IDs) and redaction in logs.
- Compliance checks equivalent to existing web implementation expectations.

## 7. Performance and Production Readiness

- Optimize screen rendering for large forms and cart lists.
- Add request deduping/caching where needed.
- Add startup hydration strategy and background refresh policy.
- Production build checks for iOS/Android, bundle size review, and startup performance.

## 8. Release Engineering

- Environment setup:
  - dev/staging/prod API configs
  - secrets management
- CI pipeline:
  - typecheck
  - lint
  - tests
  - build artifacts
- Deployment setup for Expo/EAS (or chosen release pipeline).
- Rollout plan with staged releases and monitoring.

## 9. Documentation and Handoff

- Technical docs for architecture/state/flows.
- API integration docs and error contract mapping.
- QA test plan/checklists for parity validation.
- Operational runbook for incidents and rollback.

## 10. Recommended Execution Order

1. Complete strict functional parity logic (all flow rules + validations).
2. Replace mocks with real API integrations.
3. Complete cart/payment/thank-you state machine parity.
4. Add comprehensive tests (unit -> integration -> E2E).
5. Harden error handling, telemetry, security.
6. Complete release pipeline and staged rollout.

---

## Definition of Done (Full Functional)

`shippor` can be considered fully functional when:
- all `react-shipping-tool` screens/flows/fields/conditions are behaviorally equivalent,
- all backend integrations are live and stable,
- validations and error handling match production expectations,
- full test suite passes consistently,
- and the app is release-ready for iOS/Android with monitoring in place.
