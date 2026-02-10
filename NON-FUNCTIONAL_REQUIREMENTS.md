# Shippor Non-Functional Requirements

This document defines non-functional requirements for production readiness.

## 1. Performance
- App launch to interactive state should be within acceptable mobile baseline on supported devices.
- Critical flow screens (`Send*`, `Cart`, `Payment`, `ThankYou`) must remain responsive during API operations.
- Avoid blocking UI threads during large form interactions and dynamic section toggles.
- Shipping methods, cart status, and documents loading should show immediate loading states and support retries.

## 2. Reliability
- All critical API operations must have clear failure handling and user recovery paths.
- Submission flows (quick shipment, cart submit, payment completion) must be idempotent-safe where possible.
- Route guards must prevent invalid step entry and support safe recovery when state is incomplete.

## 3. Data Integrity
- Form data must persist safely through step transitions, back navigation, and temporary interruptions.
- Draft/cart state transitions must not lose user-entered data.
- Document metadata, shipment IDs, and tracking numbers must remain consistent across screens.

## 4. Security
- Authentication tokens/session data must be stored using secure storage mechanisms.
- Sensitive fields (email, phone, tax IDs, addresses) must not be exposed in logs.
- Network requests must enforce HTTPS and secure transport assumptions in production.
- Input validation/sanitization must run both client-side and server-side.

## 5. Privacy and Compliance
- PII handling must comply with applicable data-protection requirements for target markets.
- Minimize retained personal data in client memory where not needed.
- Error reporting/telemetry must redact sensitive shipment and identity fields.

## 6. Observability
- Critical user journey telemetry required for:
  - auth success/failure
  - step progression/drop-off
  - method fetch errors
  - cart/payment failures
  - thank-you/document failures
- Production logging should support issue triage without leaking secrets/PII.

## 7. Accessibility
- Interactive controls must have accessible labels and roles.
- Tap targets should meet mobile accessibility sizing guidelines.
- Core flow must be usable with screen readers and dynamic text where feasible.

## 8. Compatibility
- Support current target iOS and Android versions defined by product scope.
- Ensure consistent behavior across device sizes (small phones to tablets where supported).

## 9. Maintainability
- Shared business rules should live in domain modules (not duplicated per screen).
- Keep feature toggles/condition matrices centralized and testable.
- Keep parity-critical mappings traceable to web counterparts.

## 10. Quality Gates (Release)
- Required before release:
  - typecheck passes
  - lint passes
  - test suite passes (unit/integration/E2E as defined)
  - no critical/high open defects in shipping flow
  - smoke test completed on iOS + Android builds
