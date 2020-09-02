export class DocumentType {
    documentTypeId: number;
    name: string;
    code: string;
    codePath: string;
    documentTypeCompany: DocumentTypeCompany = new DocumentTypeCompany();
}

export class DocumentTypeCompany {
    year: number;
    defaultNumber: number;
}
