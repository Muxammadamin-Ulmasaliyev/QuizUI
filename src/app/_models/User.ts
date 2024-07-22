export interface User {
  id : string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  password: string;
  roles : string[] ;
  createdAt : Date;

}
