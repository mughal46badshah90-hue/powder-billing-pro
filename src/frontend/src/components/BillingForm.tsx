import { useState } from "react";
import type { BillData } from "../types/billing";
import { getNextBillNumber, saveBillToParty } from "../utils/localStorage";

interface FormState {
  customerName: string;
  colourPrice: string;
  consumptionRate: string;
  gasPrice: string;
  heatDurationMinutes: string;
  electricityPricePerHour: string;
  oilPricePerHour: string;
  labourCostPerPiece: string;
  quantity: string;
  taxPercent: string;
  profitMargin: string;
}

const initialForm: FormState = {
  customerName: "",
  colourPrice: "",
  consumptionRate: "",
  gasPrice: "",
  heatDurationMinutes: "",
  electricityPricePerHour: "",
  oilPricePerHour: "",
  labourCostPerPiece: "",
  quantity: "",
  taxPercent: "",
  profitMargin: "",
};

interface BillingFormProps {
  onBillGenerated: (bill: BillData) => void;
}

type ErrorState = Partial<Record<keyof FormState, string>>;

export default function BillingForm({ onBillGenerated }: BillingFormProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<ErrorState>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function validate(): boolean {
    const newErrors: ErrorState = {};
    if (!form.customerName.trim()) newErrors.customerName = "Required";
    if (!form.colourPrice || Number.parseFloat(form.colourPrice) <= 0)
      newErrors.colourPrice = "Enter a valid value";
    if (!form.consumptionRate || Number.parseFloat(form.consumptionRate) <= 0)
      newErrors.consumptionRate = "Enter a valid value";
    if (!form.gasPrice || Number.parseFloat(form.gasPrice) <= 0)
      newErrors.gasPrice = "Enter a valid value";
    if (
      !form.heatDurationMinutes ||
      Number.parseFloat(form.heatDurationMinutes) <= 0
    )
      newErrors.heatDurationMinutes = "Enter a valid value";
    if (
      !form.electricityPricePerHour ||
      Number.parseFloat(form.electricityPricePerHour) < 0
    )
      newErrors.electricityPricePerHour = "Enter a valid value";
    if (!form.oilPricePerHour || Number.parseFloat(form.oilPricePerHour) < 0)
      newErrors.oilPricePerHour = "Enter a valid value";
    if (
      !form.labourCostPerPiece ||
      Number.parseFloat(form.labourCostPerPiece) <= 0
    )
      newErrors.labourCostPerPiece = "Enter a valid value";
    if (!form.quantity || Number.parseInt(form.quantity, 10) <= 0)
      newErrors.quantity = "Enter a valid value";
    if (form.taxPercent === "" || Number.parseFloat(form.taxPercent) < 0)
      newErrors.taxPercent = "Enter a valid value";
    if (form.profitMargin === "" || Number.parseFloat(form.profitMargin) < 0)
      newErrors.profitMargin = "Enter a valid value";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleGenerateBill(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const colourPrice = Number.parseFloat(form.colourPrice);
    const consumptionRate = Number.parseFloat(form.consumptionRate);
    const gasPrice = Number.parseFloat(form.gasPrice);
    const heatDurationMinutes = Number.parseFloat(form.heatDurationMinutes);
    const electricityPricePerHour = Number.parseFloat(
      form.electricityPricePerHour,
    );
    const oilPricePerHour = Number.parseFloat(form.oilPricePerHour);
    const labourCostPerPiece = Number.parseFloat(form.labourCostPerPiece);
    const quantity = Number.parseInt(form.quantity, 10);
    const taxPercent = Number.parseFloat(form.taxPercent);
    const profitMargin = Number.parseFloat(form.profitMargin);

    // Minutes-based calculation logic
    const heatDurationHours = heatDurationMinutes / 60;
    const powderCost = consumptionRate * colourPrice;
    const gasCost = gasPrice * heatDurationHours;
    const electricityCost = electricityPricePerHour * heatDurationHours;
    const oilCost = oilPricePerHour * heatDurationHours;
    const labourCost = labourCostPerPiece * quantity;
    const subtotal =
      powderCost + gasCost + electricityCost + oilCost + labourCost;
    const taxAmount = subtotal * (taxPercent / 100);
    const profitAmount = subtotal * (profitMargin / 100);
    const finalTotal = subtotal + taxAmount + profitAmount;

    const partyName = form.customerName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");
    const billNo = getNextBillNumber(form.customerName.trim());

    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString("en-US", { month: "short" });
    const year = now.getFullYear();
    const time = now.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const dateTime = `${day}-${month}-${year} ${time}`;

    const bill: BillData = {
      billNo,
      partyName,
      customerName: form.customerName.trim(),
      dateTime,
      colourPrice,
      consumptionRate,
      gasPrice,
      heatDurationMinutes,
      electricityPricePerHour,
      oilPricePerHour,
      labourCostPerPiece,
      quantity,
      taxPercent,
      profitMargin,
      powderCost,
      gasCost,
      electricityCost,
      oilCost,
      labourCost,
      subtotal,
      taxAmount,
      profitAmount,
      finalTotal,
    };

    // Save to party-indexed localStorage
    saveBillToParty({
      billNo,
      partyName,
      customerName: bill.customerName,
      date: dateTime,
      powderCost,
      gasCost,
      electricityCost,
      oilCost,
      labourCost,
      subtotal,
      taxAmount,
      taxPercent,
      profitAmount,
      profitMargin,
      finalTotal,
    });

    onBillGenerated(bill);

    // Clear form for next bill
    setForm(initialForm);
  }

  const inputClasses =
    "input-pbp w-full px-4 py-3 text-sm font-medium rounded-[10px] focus:outline-none";

  const fields: Array<{
    label: string;
    name: keyof FormState;
    type: string;
    placeholder: string;
    step?: string;
    min?: string;
  }> = [
    {
      label: "Customer / Party Name",
      name: "customerName",
      type: "text",
      placeholder: "Enter customer name",
    },
    {
      label: "Colour Price per kg (Rs)",
      name: "colourPrice",
      type: "number",
      placeholder: "e.g. 450.00",
      step: "0.01",
      min: "0",
    },
    {
      label: "Powder Consumption Rate (kg)",
      name: "consumptionRate",
      type: "number",
      placeholder: "e.g. 0.5",
      step: "0.001",
      min: "0",
    },
    {
      label: "Gas Price per Hour (Rs)",
      name: "gasPrice",
      type: "number",
      placeholder: "e.g. 80.00",
      step: "0.01",
      min: "0",
    },
    {
      label: "Heat Duration (minutes)",
      name: "heatDurationMinutes",
      type: "number",
      placeholder: "e.g. 90",
      step: "1",
      min: "0",
    },
    {
      label: "Electricity Cost per Hour (Rs)",
      name: "electricityPricePerHour",
      type: "number",
      placeholder: "e.g. 60.00",
      step: "0.01",
      min: "0",
    },
    {
      label: "Oil / Fuel Cost per Hour (Rs)",
      name: "oilPricePerHour",
      type: "number",
      placeholder: "e.g. 40.00",
      step: "0.01",
      min: "0",
    },
    {
      label: "Labour Cost per Piece (Rs)",
      name: "labourCostPerPiece",
      type: "number",
      placeholder: "e.g. 50.00",
      step: "0.01",
      min: "0",
    },
    {
      label: "Quantity (pieces)",
      name: "quantity",
      type: "number",
      placeholder: "e.g. 10",
      step: "1",
      min: "1",
    },
    {
      label: "Tax %",
      name: "taxPercent",
      type: "number",
      placeholder: "e.g. 18",
      step: "0.1",
      min: "0",
    },
    {
      label: "Profit Margin %",
      name: "profitMargin",
      type: "number",
      placeholder: "e.g. 15",
      step: "0.1",
      min: "0",
    },
  ];

  return (
    <form
      onSubmit={handleGenerateBill}
      noValidate
      className="bill-card p-5 space-y-4"
    >
      <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: "oklch(0.68 0.19 47)" }}
          aria-hidden="true"
        />
        New Invoice
      </h2>

      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-xs font-semibold mb-1.5 tracking-wide"
              style={{ color: "oklch(0.72 0.09 45)" }}
            >
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              inputMode={field.type === "number" ? "decimal" : "text"}
              placeholder={field.placeholder}
              step={field.step}
              min={field.min}
              value={form[field.name]}
              onChange={handleChange}
              className={inputClasses}
              aria-invalid={!!errors[field.name]}
              aria-describedby={
                errors[field.name] ? `${field.name}-error` : undefined
              }
              style={{ fontSize: "16px" /* prevent iOS zoom */ }}
            />
            {errors[field.name] && (
              <p
                id={`${field.name}-error`}
                className="text-xs mt-1"
                style={{ color: "oklch(0.65 0.18 30)" }}
                role="alert"
              >
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Generate Bill Button */}
      <button
        type="submit"
        className="btn-orange w-full py-3.5 rounded-pill font-display font-bold text-sm tracking-wide text-white mt-2"
        style={{ letterSpacing: "0.04em" }}
      >
        Generate Bill
      </button>
    </form>
  );
}
