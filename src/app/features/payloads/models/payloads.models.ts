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
}

export interface PayloadsFiltration {
  policyNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  projectId?: string;
  companyId?: string;
}

export interface Payload {
  id: number;
  quantity: number;
  policyNumber: string;
  date: Date;
  company: string;
  isActiveProject: boolean;
  image: string;
}

export enum ScanState {
  StartScan = "بدء المسح",
  ResumeScan = "استئناف المسح",
  StopScan = "إيقاف الكاميرا",
  LoadingScan = "جاري التحميل...",
}
