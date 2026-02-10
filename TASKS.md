**Still Missing For True Form/Flow Parity (Structure + Fields, not styling)**

1. **Paying party/paying address flow is not replicated**. Web flow has payer-related structure and business-entity-dependent paths; mobile does not have a dedicated paying-address/paying-type model step.
2. **Address step is still missing some conditional identity/tax structure** used in web `AddressFields` logic (full VAT tax-id type handling and related conditional variants are not fully represented).
3. **Phone input structure is not equivalent**. Web uses country-aware phone component behavior with country context; mobile still uses plain text fields with normalization.
4. **Quick method selection structure differs** from web `QuickShippingMethodSelection`: web has “most used vs all” grouping and single select-driven method picker flow; mobile uses button lists.
5. **Method card detail structure is still simplified** versus web `ShippingMethodSelectionListItem` (full expanded content variants, delivery-time block composition, and all sub-block permutations).
6. **Additional-services conditional visibility rules are incomplete**. Web hides/shows options by customer type/country/entity; mobile currently shows a flatter superset.
7. **Shipment details (commercial/proforma) structure is still partial** vs web `CommercialAndProformaInvoice` + `ShippingToolCommercialInvoicePowerMode` (radio-path + full power-mode sections are not fully matched).
8. **Dangerous goods is not a dedicated structured section** like web `DangerousGoodsSection`; mobile currently treats it mostly as a toggle/state path.
9. **Address quick-search panel structure is simplified**. Web has separate `AddressQuickSearchPanel` + `AddressBookSearchOption` patterns; mobile combines these more directly.
10. **Back/continue step gating components are not fully mirrored** to web’s exact page-level guard/layout composition (`SubmitAndBackButtons`, route-guard behavior is approximated, not identical).
11. **Cart page structure is still not 1:1** with web `CartPaymentAndShipmentController` composition and all section variants (empty/loading/retry paths improved, but not complete parity of controller structure).
12. **Thank-you flow structure is still partial** versus web `ThankYouPage`/multi-cart metadata-driven document composition (mobile has fieldsets but not full metadata-driven layout/controller structure).

If you want strict parity, next step is to treat the web component tree as the canonical checklist and implement each missing structural block one-by-one in this exact order:  
1. paying-party/address structure, 2. address field conditional matrix, 3. quick method selector structure, 4. commercial/proforma power-mode structure, 5. cart controller structure, 6. thank-you controller structure.
