import { Company } from '../common/models/company';

export class OrganizationUnit {
    organizationUnitId: number;
    companyId: number;
    company: Company;
    code: string;
    name: string;
    active: boolean;
}
