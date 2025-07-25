import { SystemRoles } from "../constants/app.constants";

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface DecodedToken {
    nameid: string;
    unique_name: string;
    role: SystemRoles;
    CompanyId: number;
    ProjectId: number;
    iat: number; // Issued at
    exp: number; // Expiration time
    nbf: number; // Not before time
}

export interface AuthUser {
    nameid: string;
    uniqueName: string;
    role: SystemRoles;
    companyId: number;
    projectId: number;
}