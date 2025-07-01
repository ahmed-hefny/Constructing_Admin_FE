export interface Project {
    id: number;
    name: string;
}

export interface ProjectPayload {
    id?: number;
    name: string;
    companiesIdsList: string[];
}