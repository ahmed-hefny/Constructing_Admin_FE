export interface UserPayload {
    id?: number,
    username: string,
    password: string,
    role: string,
    companyId: number | null
}

export interface UserResponse {
    id: number,
    username: string,
    role: string,
    companyId: number | null,
    companyName: string | null,
    projectName: string | null,
}