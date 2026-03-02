# Powder Billing Pro

## Current State
The app has a basic billing form with 8 fields (customer name, colour price, consumption rate, gas price, heat duration in hours, labour cost, quantity, tax %), a bill output with company branding (AS Paint Zone / CEO: M. Akram), PDF download, WhatsApp share, and an admin dashboard showing total bills and total sales. Bills use a single global counter. No party-wise grouping, no search bar, no electricity/oil costs, no profit margin, and no per-party admin breakdown.

## Requested Changes (Diff)

### Add
- Search bar at top of page to search bills by Party Name or Bill Number
- Electricity Cost per Hour input field
- Oil / Fuel Cost per Hour input field
- Profit Margin % input field
- Heat Duration changed from hours to minutes (all time-based costs recalculated as cost × duration_minutes / 60)
- Party-wise bill storage: each party (customer name) has its own localStorage group with independent bill numbering starting at 1
- Party folder view in Admin Dashboard showing per-party: bill count, total sales, total profit
- Search & filter functionality inside Admin Dashboard
- Profit column in bill output and PDF/WhatsApp

### Modify
- BillData type: add electricityCost, electricityPrice, oilCost, oilPrice, profitMargin, profitAmount; change heatDuration to minutes
- StoredBill type: add electricityCost, oilCost, profitAmount, partyName
- Calculation logic:
  - Gas Cost = Gas Price × (Heat Duration ÷ 60)
  - Electricity Cost = Electricity Cost per Hour × (Heat Duration ÷ 60)
  - Oil/Fuel Cost = Oil/Fuel Cost per Hour × (Heat Duration ÷ 60)
  - Subtotal = Powder + Gas + Electricity + Oil + Labour
  - Tax Amount = Subtotal × (Tax / 100)
  - Profit Amount = Subtotal × (Profit% / 100)
  - Total Bill = Subtotal + Tax + Profit
- localStorage utilities: replace single global counter with per-party counters; add party-indexed bill storage
- BillingForm: add new fields, update labels and calculation
- BillOutput: show Electricity Cost, Oil Cost, Profit; update PDF and WhatsApp text
- AdminDashboard: per-party breakdown with search/filter; total profit stat

### Remove
- Global bill counter (replaced by per-party counter)
- Global bill history key (replaced by per-party storage)

## Implementation Plan
1. Update `types/billing.ts` — extend BillData and StoredBill with new fields
2. Rewrite `utils/localStorage.ts` — party-indexed storage, per-party bill numbering, per-party stats helpers
3. Rewrite `BillingForm.tsx` — add electricity, oil, profit margin fields; minutes-based calculation
4. Rewrite `BillOutput.tsx` — show new cost rows, update PDF layout and WhatsApp text
5. Rewrite `AdminDashboard.tsx` — per-party stats, search/filter
6. Update `App.tsx` — add search bar at top, wire search state to filter displayed bills or navigate to party
