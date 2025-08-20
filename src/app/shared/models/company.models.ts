export interface CompanyResponse {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  isDeleted: boolean;
  companyList: CompanyResponse[];
}
