export interface UserPayload {
    id?: number,
    username: string,
    password: string,
    role: string,
    companyId: number | null
}