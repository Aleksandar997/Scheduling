import { User } from '../common/models/user';

export class Employee {
    employeeId: number;
    user: User;
    identificationNumber: string;
    active: boolean;
}
