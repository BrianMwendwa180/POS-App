# Customer Page Enhancements TODO

## Backend Updates
- [x] Modify `getCustomer` in `server/controllers/customerController.js` to include `recentSales` (last 5 sales)
- [x] Add `getCustomer` function to `client/src/services/api.ts`

## Frontend Updates
- [x] Update `Customer` interface in `client/src/types/index.ts` to include `recentSales?: Sale[]`
- [ ] Update `client/src/components/Customers/Customers.tsx`:
  - [ ] Add edit customer modal with form
  - [ ] Add customer details modal with full info and recent sales
  - [ ] Add export to CSV functionality
  - [ ] Add import from CSV functionality
  - [ ] Add sorting dropdown (name, total purchases desc, last purchase desc)
  - [ ] Add pagination (10 per page if >50 customers)
  - [ ] Improve mobile responsiveness

## Testing
- [ ] Test edit functionality
- [ ] Test details modal
- [ ] Test export/import CSV
- [ ] Test sorting and pagination
- [ ] Verify responsiveness on different screen sizes
- [ ] Run app and check for errors
