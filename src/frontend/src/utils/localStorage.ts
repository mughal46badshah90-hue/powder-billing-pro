import type { StoredBill } from "../types/billing";

const PARTY_BILLS_KEY = "pbp_party_";
const PARTY_COUNTER_KEY = "pbp_counter_";

function normalizePartyName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "_");
}

export function getNextBillNumber(partyName: string): number {
  const key = PARTY_COUNTER_KEY + normalizePartyName(partyName);
  try {
    const current = localStorage.getItem(key);
    const next = current ? Number.parseInt(current, 10) + 1 : 1;
    localStorage.setItem(key, next.toString());
    return next;
  } catch {
    return 1;
  }
}

export function saveBillToParty(bill: StoredBill): void {
  const key = PARTY_BILLS_KEY + normalizePartyName(bill.partyName);
  try {
    const existing = getPartyBills(bill.partyName);
    const updated = [bill, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    // storage unavailable
  }
}

export function getPartyBills(partyName: string): StoredBill[] {
  const key = PARTY_BILLS_KEY + normalizePartyName(partyName);
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as StoredBill[]) : [];
  } catch {
    return [];
  }
}

export function getAllPartyNames(): string[] {
  const names: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PARTY_BILLS_KEY)) {
        names.push(k.slice(PARTY_BILLS_KEY.length));
      }
    }
  } catch {
    // storage unavailable
  }
  return names;
}

export function getAllBills(): StoredBill[] {
  const partyNames = getAllPartyNames();
  const all: StoredBill[] = [];
  for (const name of partyNames) {
    const bills = getPartyBills(name);
    all.push(...bills);
  }
  // Sort newest first by date string — bills store ISO-like date strings
  // We keep insertion order (newest first per party), so just flatten as-is
  // but also sort by billNo descending across parties for consistency
  return all.sort((a, b) => {
    // Compare by date descending — fall back to billNo
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return b.billNo - a.billNo;
  });
}

export function getPartyStats(partyName: string): {
  totalBills: number;
  totalSales: number;
  totalProfit: number;
} {
  const bills = getPartyBills(partyName);
  return {
    totalBills: bills.length,
    totalSales: bills.reduce((sum, b) => sum + b.finalTotal, 0),
    totalProfit: bills.reduce((sum, b) => sum + b.profitAmount, 0),
  };
}

export function getGlobalStats(): {
  totalBills: number;
  totalSales: number;
  totalProfit: number;
} {
  const bills = getAllBills();
  return {
    totalBills: bills.length,
    totalSales: bills.reduce((sum, b) => sum + b.finalTotal, 0),
    totalProfit: bills.reduce((sum, b) => sum + b.profitAmount, 0),
  };
}

export function searchBills(query: string): StoredBill[] {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();
  const all = getAllBills();
  return all.filter(
    (b) =>
      b.customerName.toLowerCase().includes(q) ||
      b.partyName.toLowerCase().includes(q) ||
      b.billNo.toString() === q,
  );
}
