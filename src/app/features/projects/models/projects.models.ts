import { CompanyResponse } from "app/shared/models/company.models";

export interface Project {
    id: number;
    name: string;
    companyList: CompanyResponse[];
    isDeleted?: boolean;
    resource?: string;
    allQnt?: string;
}

export interface ProjectPayload {
    id?: number;
    name: string;
    companiesIdsList: string[];
}