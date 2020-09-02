import { User } from '../common/models/user';

export class Employee {
    employeeId: number;
    identificationNumber: string;
    active: boolean;
    organizationUnits: Array<number>;
    products: Array<number>;
}


