import { Student } from "../Student";

export interface GetStudentsPageResponseModel{
    totalRecords : number,
    students : Student[]
}