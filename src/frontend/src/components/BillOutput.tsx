import type { BillData } from "../types/billing";

interface BillOutputProps {
  bill: BillData;
}

function fmt(n: number): string {
  return `Rs ${n.toFixed(2)}`;
}

type JsPDFCtor = new (opts: Record<string, unknown>) => Record<string, unknown>;

function downloadPDF(bill: BillData): void {
  const jsPDFLib = (window as Window & { jspdf?: { jsPDF: JsPDFCtor } }).jspdf;
  if (!jsPDFLib) {
    alert(
      "PDF library not loaded. Please check your internet connection and try again.",
    );
    return;
  }
  const { jsPDF } = jsPDFLib;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = new jsPDF({ unit: "mm", format: "a5" });

  const pageW = doc.internal.pageSize.getWidth();
  const cx = pageW / 2;

  // Dark background
  doc.setFillColor(18, 12, 4);
  doc.rect(0, 0, pageW, 210, "F");

  // Orange top bar
  doc.setFillColor(220, 100, 10);
  doc.rect(0, 0, pageW, 10, "F");

  // Company Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("AS Paint Zone", cx, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(220, 100, 10);
  doc.text("CEO: M. Akram", cx, 27, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 140, 80);
  doc.text("Powder Billing Pro", cx, 33, { align: "center" });

  // Divider
  doc.setDrawColor(220, 100, 10);
  doc.setLineWidth(0.5);
  doc.line(10, 38, pageW - 10, 38);

  // Bill meta
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(220, 100, 10);
  doc.text(`Bill No: ${bill.billNo}`, 10, 44);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text(bill.dateTime, pageW - 10, 44, { align: "right" });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Customer: ${bill.customerName}`, 10, 51);

  // Divider
  doc.setDrawColor(60, 40, 20);
  doc.setLineWidth(0.3);
  doc.line(10, 55, pageW - 10, 55);

  // Section label
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 140, 80);
  doc.text("COST BREAKDOWN", 10, 61);

  // Cost rows
  const rows: [string, string][] = [
    ["Powder Cost", fmt(bill.powderCost)],
    ["Gas Cost", fmt(bill.gasCost)],
    ["Electricity Cost", fmt(bill.electricityCost)],
    ["Oil / Fuel Cost", fmt(bill.oilCost)],
    ["Labour Cost", fmt(bill.labourCost)],
  ];

  doc.setFontSize(10);
  let y = 69;
  for (const [label, value] of rows) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 200, 200);
    doc.text(label, 10, y);
    doc.setTextColor(255, 200, 100);
    doc.text(value, pageW - 10, y, { align: "right" });
    y += 8;
  }

  // Subtotal
  doc.setDrawColor(60, 40, 20);
  doc.setLineWidth(0.3);
  doc.line(10, y, pageW - 10, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 180);
  doc.text("Subtotal", 10, y);
  doc.setTextColor(255, 200, 100);
  doc.text(fmt(bill.subtotal), pageW - 10, y, { align: "right" });
  y += 8;

  // Tax
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 180);
  doc.text(`Tax (${bill.taxPercent}%)`, 10, y);
  doc.setTextColor(255, 200, 100);
  doc.text(fmt(bill.taxAmount), pageW - 10, y, { align: "right" });
  y += 8;

  // Profit
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 180);
  doc.text(`Profit (${bill.profitMargin}%)`, 10, y);
  doc.setTextColor(255, 200, 100);
  doc.text(fmt(bill.profitAmount), pageW - 10, y, { align: "right" });
  y += 4;

  // Total divider
  doc.setDrawColor(220, 100, 10);
  doc.setLineWidth(0.5);
  doc.line(10, y, pageW - 10, y);
  y += 7;

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL BILL", 10, y);
  doc.setTextColor(220, 100, 10);
  doc.text(fmt(bill.finalTotal), pageW - 10, y, { align: "right" });
  y += 12;

  // Bottom divider
  doc.setDrawColor(60, 40, 20);
  doc.setLineWidth(0.3);
  doc.line(10, y, pageW - 10, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(180, 140, 80);
  doc.text("Thank you for your business!", cx, y, { align: "center" });

  // Orange bottom bar
  doc.setFillColor(220, 100, 10);
  doc.rect(0, 200, pageW, 10, "F");

  const filename = `Bill_${bill.billNo}_${bill.customerName.replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
}

function buildWhatsAppText(bill: BillData): string {
  const sep = "─────────────────────";
  const lines = [
    "*AS Paint Zone*",
    "CEO: M. Akram",
    sep,
    `Bill No: ${bill.billNo}`,
    `Customer: ${bill.customerName}`,
    `Date: ${bill.dateTime}`,
    sep,
    `Powder Cost       : ${fmt(bill.powderCost)}`,
    `Gas Cost          : ${fmt(bill.gasCost)}`,
    `Electricity Cost  : ${fmt(bill.electricityCost)}`,
    `Oil / Fuel Cost   : ${fmt(bill.oilCost)}`,
    `Labour Cost       : ${fmt(bill.labourCost)}`,
    sep,
    `Subtotal          : ${fmt(bill.subtotal)}`,
    `Tax (${bill.taxPercent}%)         : ${fmt(bill.taxAmount)}`,
    `Profit (${bill.profitMargin}%)      : ${fmt(bill.profitAmount)}`,
    sep,
    `*TOTAL BILL: ${fmt(bill.finalTotal)}*`,
    sep,
    "Thank You For Your Business!",
  ];
  return lines.join("\n");
}

export default function BillOutput({ bill }: BillOutputProps) {
  function handleDownloadPDF() {
    downloadPDF(bill);
  }

  function handleWhatsApp() {
    const text = buildWhatsAppText(bill);
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="bill-card p-5" aria-label="Generated Bill">
      {/* Invoice Header */}
      <div
        className="text-center mb-5 pb-4"
        style={{ borderBottom: "1px dashed oklch(0.30 0.025 35)" }}
      >
        {/* Company Branding */}
        <div className="mb-3">
          <h2
            className="font-display font-bold text-xl"
            style={{ color: "oklch(0.76 0.20 55)" }}
          >
            AS Paint Zone
          </h2>
          <p
            className="text-sm font-medium mt-0.5"
            style={{ color: "oklch(0.68 0.19 47 / 0.85)" }}
          >
            CEO: M. Akram
          </p>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px dashed oklch(0.30 0.025 35)",
            marginBottom: "12px",
          }}
        />

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">Bill No.</p>
            <p
              className="font-mono font-bold text-lg"
              style={{ color: "oklch(0.68 0.19 47)" }}
            >
              {bill.billNo}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Date &amp; Time</p>
            <p className="text-xs font-medium text-foreground">
              {bill.dateTime}
            </p>
          </div>
        </div>
        <div className="mt-3 text-left">
          <p className="text-xs text-muted-foreground">Customer</p>
          <p className="font-display font-semibold text-base text-foreground">
            {bill.customerName}
          </p>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-2.5 mb-4">
        <h3
          className="text-xs font-bold uppercase tracking-wider mb-3"
          style={{ color: "oklch(0.68 0.19 47)" }}
        >
          Cost Breakdown
        </h3>
        {[
          { label: "Powder Cost", value: bill.powderCost },
          { label: "Gas Cost", value: bill.gasCost },
          { label: "Electricity Cost", value: bill.electricityCost },
          { label: "Oil / Fuel Cost", value: bill.oilCost },
          { label: "Labour Cost", value: bill.labourCost },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-mono text-sm font-medium text-foreground">
              {fmt(value)}
            </span>
          </div>
        ))}

        <div
          className="flex justify-between items-center pt-2.5"
          style={{ borderTop: "1px solid oklch(0.26 0.022 35)" }}
        >
          <span className="text-sm text-muted-foreground">Subtotal</span>
          <span className="font-mono text-sm font-semibold text-foreground">
            {fmt(bill.subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Tax ({bill.taxPercent}%)
          </span>
          <span className="font-mono text-sm font-medium text-foreground">
            {fmt(bill.taxAmount)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Profit ({bill.profitMargin}%)
          </span>
          <span className="font-mono text-sm font-medium text-foreground">
            {fmt(bill.profitAmount)}
          </span>
        </div>
      </div>

      {/* Final Total */}
      <div
        className="rounded-xl p-4 flex justify-between items-center mb-5"
        style={{
          background: "oklch(0.68 0.19 47 / 0.12)",
          border: "1.5px solid oklch(0.68 0.19 47 / 0.4)",
        }}
      >
        <span className="font-display font-bold text-sm text-foreground">
          TOTAL BILL
        </span>
        <span
          className="font-mono font-bold text-xl text-glow-orange"
          style={{ color: "oklch(0.76 0.20 55)" }}
        >
          {fmt(bill.finalTotal)}
        </span>
      </div>

      {/* Thank You */}
      <p
        className="text-center text-xs font-medium mb-5"
        style={{ color: "oklch(0.68 0.19 47 / 0.8)" }}
      >
        Thank You For Your Business!
      </p>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleDownloadPDF}
          className="btn-orange w-full py-3.5 rounded-pill font-display font-bold text-sm tracking-wide text-white flex items-center justify-center gap-2"
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download PDF
        </button>

        <button
          type="button"
          onClick={handleWhatsApp}
          className="btn-whatsapp w-full py-3.5 rounded-pill font-display font-bold text-sm tracking-wide text-white flex items-center justify-center gap-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Share on WhatsApp
        </button>
      </div>
    </section>
  );
}
