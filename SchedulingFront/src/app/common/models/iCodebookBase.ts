import { BasePaging } from './basePaging';

export interface ICodebookBase {
    name: string;
    code: string;
}

export class CodebookPaging extends BasePaging {
    name: string;
    code: string;
}
