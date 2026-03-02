import { useMemo, useState } from "react";
import type { StoredBill } from "../types/billing";
import {
  getAllPartyNames,
  getGlobalStats,
  getPartyBills,
  getPartyStats,
} from "../utils/localStorage";

function fmt(n: number): string {
  return `Rs ${n.toFixed(2)}`;
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{
        background: "oklch(0.68 0.19 47 / 0.10)",
        border: "1px solid oklch(0.68 0.19 47 / 0.3)",
      }}
    >
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p
        className="font-mono font-bold text-base leading-tight break-all"
        style={{ color: "oklch(0.76 0.20 55)" }}
      >
        {value}
      </p>
    </div>
  );
}

interface PartyRowProps {
  partyName: string;
  filterQuery: string;
}

function PartyRow({ partyName, filterQuery }: PartyRowProps) {
  const [expanded, setExpanded] = useState(false);
  const stats = useMemo(() => getPartyStats(partyName), [partyName]);
  const bills = useMemo(() => getPartyBills(partyName), [partyName]);

  const filteredBills = useMemo(() => {
    if (!filterQuery.trim()) return bills;
    const q = filterQuery.trim().toLowerCase();
    return bills.filter(
      (b) =>
        b.customerName.toLowerCase().includes(q) || b.billNo.toString() === q,
    );
  }, [bills, filterQuery]);

  // Display name: capitalize words from normalized key
  const displayName = partyName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid oklch(0.26 0.022 35)" }}
    >
      {/* Party Header */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full px-4 py-3 flex items-center justify-between text-left transition-colors"
        style={{
          background: expanded
            ? "oklch(0.18 0.015 30)"
            : "oklch(0.16 0.013 30)",
        }}
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
            style={{
              background: "oklch(0.68 0.19 47 / 0.2)",
              color: "oklch(0.76 0.20 55)",
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-sm text-foreground truncate">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.totalBills} bill{stats.totalBills !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-2 shrink-0">
          <div className="text-right">
            <p
              className="font-mono text-sm font-bold"
              style={{ color: "oklch(0.76 0.20 55)" }}
            >
              {fmt(stats.totalSales)}
            </p>
            <p className="text-xs" style={{ color: "oklch(0.62 0.16 140)" }}>
              +{fmt(stats.totalProfit)} profit
            </p>
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground transition-transform duration-200"
            style={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Bills list */}
      {expanded && (
        <div
          style={{ background: "oklch(0.13 0.010 30)" }}
          className="px-3 py-2"
        >
          {filteredBills.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-3">
              No bills match this search.
            </p>
          ) : (
            <ul className="space-y-1.5" aria-label={`Bills for ${displayName}`}>
              {filteredBills.map((bill) => (
                <BillItem
                  key={`${bill.partyName}-${bill.billNo}`}
                  bill={bill}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function BillItem({ bill }: { bill: StoredBill }) {
  return (
    <li
      className="rounded-lg px-3 py-2.5 flex items-center justify-between"
      style={{
        background: "oklch(0.17 0.014 30)",
        border: "1px solid oklch(0.24 0.022 35)",
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-xs font-bold shrink-0"
            style={{ color: "oklch(0.68 0.19 47)" }}
          >
            #{bill.billNo.toString().padStart(3, "0")}
          </span>
          <span className="text-sm font-semibold truncate text-foreground">
            {bill.customerName}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {bill.date}
        </p>
      </div>
      <div className="ml-3 shrink-0 text-right">
        <span
          className="font-mono text-sm font-bold block"
          style={{ color: "oklch(0.76 0.20 55)" }}
        >
          {fmt(bill.finalTotal)}
        </span>
        {bill.profitAmount > 0 && (
          <span
            className="font-mono text-xs block"
            style={{ color: "oklch(0.62 0.16 140)" }}
          >
            +{fmt(bill.profitAmount)}
          </span>
        )}
      </div>
    </li>
  );
}

export default function AdminDashboard() {
  const [filterQuery, setFilterQuery] = useState("");

  const partyNames = useMemo(() => getAllPartyNames(), []);
  const globalStats = useMemo(() => getGlobalStats(), []);

  const filteredParties = useMemo(() => {
    if (!filterQuery.trim()) return partyNames;
    const q = filterQuery.trim().toLowerCase();
    return partyNames.filter((name) => {
      // Match party name or any bill in the party
      if (name.toLowerCase().includes(q)) return true;
      const bills = getPartyBills(name);
      return bills.some(
        (b) =>
          b.customerName.toLowerCase().includes(q) || b.billNo.toString() === q,
      );
    });
  }, [partyNames, filterQuery]);

  return (
    <div className="dashboard-panel p-5 space-y-5">
      {/* Header */}
      <h2
        className="font-display text-base font-bold flex items-center gap-2"
        style={{ color: "oklch(0.68 0.19 47)" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        Admin Dashboard
      </h2>

      {/* Global Summary Stats — 3 cards */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Total Bills" value={globalStats.totalBills} />
        <StatCard label="Total Sales" value={fmt(globalStats.totalSales)} />
        <StatCard label="Total Profit" value={fmt(globalStats.totalProfit)} />
      </div>

      {/* Search / Filter */}
      <div className="relative">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          placeholder="Filter by party name or bill number..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="input-pbp w-full pl-9 pr-4 py-2.5 text-sm rounded-[10px] focus:outline-none"
          style={{ fontSize: "16px" }}
          aria-label="Filter parties and bills"
        />
      </div>

      {/* Party List */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-muted-foreground">
          Party Folders ({filteredParties.length})
        </h3>

        {partyNames.length === 0 ? (
          <div
            className="rounded-xl p-6 text-center"
            style={{
              background: "oklch(0.16 0.014 30)",
              border: "1px dashed oklch(0.26 0.022 35)",
            }}
          >
            <p className="text-sm text-muted-foreground">
              No bills generated yet.
            </p>
            <p className="text-xs text-muted-foreground mt-1 opacity-60">
              Bills will appear here after you generate them.
            </p>
          </div>
        ) : filteredParties.length === 0 ? (
          <div
            className="rounded-xl p-6 text-center"
            style={{
              background: "oklch(0.16 0.014 30)",
              border: "1px dashed oklch(0.26 0.022 35)",
            }}
          >
            <p className="text-sm text-muted-foreground">
              No parties match "{filterQuery}".
            </p>
          </div>
        ) : (
          <ul className="space-y-2" aria-label="Party folders">
            {filteredParties.map((partyName) => (
              <li key={partyName}>
                <PartyRow partyName={partyName} filterQuery={filterQuery} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
