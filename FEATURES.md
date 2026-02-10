# Shippor Required Features

This file captures the original requested feature scope for the Shippor Expo app.

## Core Product Direction
- Build an Expo app called `shippor`.
- Use the latest Expo.
- API integrations can be stubbed initially.

## Authentication
- Log in
- Register
- Forgot password
- Reset password

## Shipping Tool Parity Requirement
- Include the full feature set of `/Users/brian/Developer/react-shipping-tool`.
- Replace all steps/pages/forms/validation/carts/etc. from the web tool into mobile.
- This app is a mobile app version of the React shipping tool.

## Shipment Tracking and History
- Track shipments the user has made.

## Bottom Navigation
- Home
- Shipments
- Send (big blue round button with a letter/paper-plane icon)
- Track
- Settings

## Home Screen Requirements
- Show account balance.
- Show counts for:
  - pending shipments
  - out for delivery
  - delivered

## Address Book Requirement
- For sender/recipient selection, users must be able to choose from an address book.
- This address book is separate from phone contacts.

## Implementation Priority Direction
- Focus first on replicating `react-shipping-tool` flows/screens/forms structure.
- Prioritize UI and flow parity first.
- Defer tests early until UI/flow is fully validated.
- Ensure as-close-as-possible parity so customers can switch between web and mobile with the same expected fields/order/flow.
