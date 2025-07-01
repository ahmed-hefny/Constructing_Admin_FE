import { CompanyResponse } from "app/shared/models/company.models";

export interface Project {
    id: number;
    name: string;
    companyList: CompanyResponse[];
}

export interface ProjectPayload {
    id?: number;
    name: string;
    companiesIdsList: string[];
}