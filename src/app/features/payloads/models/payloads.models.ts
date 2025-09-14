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

export enum ScanState {
    StartScan = 'بدء المسح',
    ResumeScan = 'استئناف المسح',
    StopScan = 'إيقاف الكاميرا',
    LoadingScan = 'جاري التحميل...'
}