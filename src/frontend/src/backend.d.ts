import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Bill {
    customerName: string;
    finalTotal: number;
    labourCost: number;
    powderCost: number;
    number: bigint;
    timestamp: Time;
    taxAmount: number;
    gasCost: number;
    subtotal: number;
}
export type Time = bigint;
export interface backendInterface {
    getAllBills(): Promise<Array<Bill>>;
    getTotalBillCount(): Promise<bigint>;
    getTotalSalesAmount(): Promise<number>;
    saveBill(customerName: string, powderCost: number, gasCost: number, labourCost: number, taxRate: number): Promise<bigint>;
}
