import { Status } from './Status';
import { Teacher } from './Teacher';

export interface Student {
  id: number;
  name: string;
  country: string;
  teacher: Teacher;
  teacherId : number;
  date : Date;
  contract : number;
  status : Status;
  imageUrl : string;
}
