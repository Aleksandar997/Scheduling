import { DocumentDetail } from './documentDetail';
import { OrganizationUnit } from './organizationUnit';
import { PriceListType } from './priceListType';
import { Schedule } from './schedule';
import { DocumentStatus } from './documentStatus';
import { DocumentType } from './documentType';
import { BasePaging } from '../common/models/basePaging';

export class Document {
    documentId: number;
    documentTypeId: number;
    documentType: DocumentType = new DocumentType();
    documentStatusId: number;
    documentStatus: DocumentStatus;
    number: number;
    year: number;
    customerName: string;
    organizationUnitNames: string;
    fullNumber: string;
    date: Date;
    issuingPlace: string;
    dateTo: Date;
    dateFrom: Date;
    note: string;
    scheduleId: number;
    schedule: Schedule;
    discount: number;
    sum: number;
    paid: number;
    pricelistTypeId: number;
    priceListType: PriceListType;
    change: number;
    organizationUnitId: number;
    documentDetails: Array<DocumentDetail>;
    organizationUnits: Array<OrganizationUnit>;
    organizationUnitIds: Array<number>;
}

export class DocumentPaging extends BasePaging {
    documentType: string;
    documentNumber: string;
    organizationUnits: Array<number> = new Array<number>();
    customers: Array<number> = new Array<number>();
    priceListTypes: Array<number> = new Array<number>();
    date: Date;
    dateFrom: Date;
    dateTo: Date;
    documentStatusId: number;
    constructor(documentType: string) {
        super();
        this.documentType = documentType;
    }
}
