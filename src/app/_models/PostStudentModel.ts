import { Status } from './Status';

export interface PostStudentModel {
  name: string;
  country: string;
  teacherId: number;
  contract: number;
  status: Status;
}
