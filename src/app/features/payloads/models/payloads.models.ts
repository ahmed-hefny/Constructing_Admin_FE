import { PaginationResponse } from "app/core/models";

export interface PayloadConfig {
  id?: number;
  projectId: string;
  companyId: string;
}

export interface PayloadModel {
  id: number;
  quantity: number;
  policyNumber: string;
  date: string;
  company: string;
  isActiveProject: boolean;
  image: string;
  isManual?: boolean;
  isModified?: boolean;
}

export interface PayloadsFiltration {
  policyNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  projectId?: string;
  companyId?: string;
}

export interface PayloadResponse extends PaginationResponse<PayloadModel> {
  supplierTotals?: SupplierTotals;
}

export interface SupplierTotals {
  arishTotal: number;
  benniSuifTotal: number;
}

export enum ScanState {
  StartScan = "بدء المسح",
  ResumeScan = "استئناف المسح",
  StopScan = "إيقاف الكاميرا",
  LoadingScan = "جاري التحميل...",
}

export enum ExportType {
  Arish = 1,
  Bennisuif = 2,
}
