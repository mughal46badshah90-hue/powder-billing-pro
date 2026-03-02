export interface BillData {
  billNo: number; // per-party bill number
  partyName: string; // normalized party name key (trimmed, lowercased)
  customerName: string; // display name
  dateTime: string;
  colourPrice: number;
  consumptionRate: number;
  gasPrice: number;
  heatDurationMinutes: number;
  electricityPricePerHour: number;
  oilPricePerHour: number;
  labourCostPerPiece: number;
  quantity: number;
  taxPercent: number;
  profitMargin: number;
  powderCost: number;
  gasCost: number;
  electricityCost: number;
  oilCost: number;
  labourCost: number;
  subtotal: number;
  taxAmount: number;
  profitAmount: number;
  finalTotal: number;
}

export interface StoredBill {
  billNo: number;
  partyName: string; // normalized key
  customerName: string; // display name
  date: string;
  powderCost: number;
  gasCost: number;
  electricityCost: number;
  oilCost: number;
  labourCost: number;
  subtotal: number;
  taxAmount: number;
  taxPercent: number;
  profitAmount: number;
  profitMargin: number;
  finalTotal: number;
}
