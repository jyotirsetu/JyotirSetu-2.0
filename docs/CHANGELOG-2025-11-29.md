# Admin Feature Updates – 2025-11-29

## Quotation Status Update
- Total Amount now excludes `Cancelled` quotations.
- Prevented negative totals via clamping to `0`.
- Audit logs added:
  - `quote_status_changed` with details `from -> to`.
  - Existing `quote_created`, `quote_updated`, `quote_deleted` retained.
- Frontend broadcasts `quotesStatsUpdated` in `localStorage` so Dashboard refreshes totals immediately.

### API Changes
- `GET /api/admin/quotes?stats=1` → `totals.amount` excludes `Cancelled`.

## Client 360 Enhancements
- Added customer search and sync using paginated `appointments` data.
- Reliable loading for large datasets with deduplication by name+email+phone.

## Follow Hub Insights
- `GET /api/admin/follow-hub/events` now returns:
  - `ip_address` (full) and `location` (derived via ipapi.co).
- Insights UI shows new `IP` and `Location` columns and exports them in CSV.

## Activity Log Improvements
- Action filter dropdown is populated dynamically from recent logs to include all actions (e.g., `whatsapp_sent`, `email_failed`, `quote_status_changed`).

## Mobile Responsiveness
- Dashboard stat cards use a 2-column grid on small screens; reduced padding and font sizes.
- Quotation stat cards resized for mobile readability.

## Testing
- Added unit tests (`scripts/run-tests.js`) covering:
  - Quotes totals computation excluding `Cancelled` and non-negative amounts.
  - IP geolocation formatting.

## Backward Compatibility
- No breaking changes to existing endpoints beyond refined `totals.amount` semantics.
- Existing data remains compatible.
