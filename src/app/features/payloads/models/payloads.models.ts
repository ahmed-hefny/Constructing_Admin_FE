export interface PayloadConfig {
  projectId: string;
  companyId: string;
}

export interface PayloadsFiltration {
  policyNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  projectId?: string;
  companyId?: string;
}

export interface Payload {
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
