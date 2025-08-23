import { CompanyResponse } from "app/shared/models/company.models";

export interface Project {
    id: number;
    name: string;
    companyList: CompanyResponse[];
    isDeleted?: boolean;
    resource?: string;
    totalQuantity?: string;
    supplierList: ProjectSupplier[];
}

export interface ProjectPayload {
    id?: number;
    name: string;
    companiesIdsList: string[];
}

export interface ProjectSupplier {
    quantity: number;
    name: string;
}