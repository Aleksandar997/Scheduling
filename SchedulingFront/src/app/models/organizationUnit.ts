import { Company } from '../common/models/company';
import { BasePaging } from '../common/models/basePaging';

export class OrganizationUnit {
    id: number;
    organizationUnitId: number;
    companyId: number;
    company: Company;
    code: string;
    name: string;
    active: boolean;
}

export class OrganizationUnitPaging extends BasePaging {
    code: string;
    name: string;
}
