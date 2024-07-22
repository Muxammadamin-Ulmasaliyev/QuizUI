import { User } from "../User";

export interface GetUsersPageResponseModel{
    totalRecords : number,
    users : User[]
}