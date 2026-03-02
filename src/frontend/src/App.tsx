import { Toaster } from "@/components/ui/sonner";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import AdminDashboard from "./components/AdminDashboard";
import BillOutput from "./components/BillOutput";
import BillingForm from "./components/BillingForm";
import type { BillData, StoredBill } from "./types/billing";
import { searchBills } from "./utils/localStorage";

function fmt(n: number): string {
  return `Rs ${n.toFixed(2)}`;
}

export default function App() {
  const [currentBill, setCurrentBill] = useState<BillData | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StoredBill[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleBillGenerated = useCallback((bill: BillData) => {
    setCurrentBill(bill);
    toast.success(`Bill #${bill.billNo} generated for ${bill.customerName}!`);
  }, []);

  const handleToggleDashboard = useCallback(() => {
    setShowDashboard((prev) => !prev);
  }, []);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim()) {
      const results = searchBills(q);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }

  function handleSearchBlur() {
    // Small delay so clicks on results register
    setTimeout(() => setShowSearchResults(false), 150);
  }

  function handleSearchFocus() {
    if (searchQuery.trim() && searchResults.length > 0) {
      setShowSearchResults(true);
    }
  }

  return (
    <div className="pbp-bg min-h-screen py-6 px-4">
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: {
            background: "oklch(0.15 0.012 30)",
            border: "1px solid oklch(0.68 0.19 47 / 0.4)",
            color: "oklch(0.95 0.012 50)",
          },
        }}
      />

      <div className="mx-auto w-full max-w-billing">
        {/* Header */}
        <header className="text-center mb-6 animate-fade-in-up">
          <img
            src="/assets/generated/powder-billing-logo-transparent.dim_200x200.png"
            alt="Powder Billing Pro Logo"
            width={80}
            height={80}
            className="mx-auto mb-3 drop-shadow-lg"
            style={{
              filter: "drop-shadow(0 0 12px oklch(0.68 0.19 47 / 0.5))",
            }}
          />
          <h1 className="font-display text-2xl font-bold tracking-tight gradient-text-orange">
            Powder Billing Pro
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Professional Powder Coating Invoices
          </p>
        </header>

        {/* Search Bar + Admin Dashboard Button Row */}
        <div className="mb-5 flex items-center gap-2 animate-fade-in-up">
          {/* Search Bar */}
          <div className="relative flex-1" ref={searchRef}>
            <svg
              width="15"
              height="15"
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
              placeholder="Search bills by name or bill no."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="input-pbp w-full pl-9 pr-4 py-2.5 text-sm rounded-[10px] focus:outline-none"
              style={{ fontSize: "16px" }}
              aria-label="Search bills"
            />

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div
                className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50"
                style={{
                  background: "oklch(0.15 0.012 30)",
                  border: "1px solid oklch(0.30 0.025 35)",
                  boxShadow: "0 8px 24px oklch(0 0 0 / 0.5)",
                  maxHeight: "280px",
                  overflowY: "auto",
                }}
                aria-label="Search results"
              >
                {searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                    No bills found for &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  searchResults.map((bill) => (
                    <div
                      key={`${bill.partyName}-${bill.billNo}`}
                      className="px-4 py-3 flex items-center justify-between cursor-default"
                      style={{
                        borderBottom: "1px solid oklch(0.22 0.018 35)",
                      }}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-xs font-bold shrink-0"
                            style={{ color: "oklch(0.68 0.19 47)" }}
                          >
                            #{bill.billNo}
                          </span>
                          <span className="text-sm font-semibold text-foreground truncate">
                            {bill.customerName}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {bill.date}
                        </p>
                      </div>
                      <span
                        className="font-mono text-sm font-bold ml-3 shrink-0"
                        style={{ color: "oklch(0.76 0.20 55)" }}
                      >
                        {fmt(bill.finalTotal)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Admin Dashboard Toggle Button */}
          <button
            type="button"
            onClick={handleToggleDashboard}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-[10px] text-xs font-semibold transition-all duration-200 shrink-0"
            style={{
              border: "1.5px solid oklch(0.68 0.19 47 / 0.6)",
              color: "oklch(0.72 0.18 47)",
              background: showDashboard
                ? "oklch(0.68 0.19 47 / 0.15)"
                : "transparent",
            }}
            aria-expanded={showDashboard}
            aria-label="Toggle Admin Dashboard"
          >
            <svg
              width="14"
              height="14"
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
            Dashboard
          </button>
        </div>

        {/* Admin Dashboard Panel */}
        {showDashboard && (
          <div className="mb-6 animate-fade-in-up">
            <AdminDashboard />
          </div>
        )}

        {/* Billing Form */}
        <BillingForm onBillGenerated={handleBillGenerated} />

        {/* Bill Output */}
        {currentBill && (
          <div className="mt-6 animate-fade-in-up">
            <BillOutput bill={currentBill} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-muted-foreground py-4">
          <p>
            © {new Date().getFullYear()}. Built with{" "}
            <span style={{ color: "oklch(0.68 0.19 47)" }}>♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-80 transition-opacity"
              style={{ color: "oklch(0.68 0.19 47)" }}
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
