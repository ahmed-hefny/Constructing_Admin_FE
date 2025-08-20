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