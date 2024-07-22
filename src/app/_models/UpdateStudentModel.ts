import { Status } from './Status';

export interface UpdateStudentModel {
  id: number;
  name: string;
  country: string;
  teacherId: number;
  contract: number;
  status: Status;
  imageUrl : string;

}
