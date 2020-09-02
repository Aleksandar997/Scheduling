import { Translate } from './translate';
import { BasePaging } from './basePaging';

export class Resource {
    resourceId: number;
    name: string;
    translates: Array<Translate>;
}

export class ResourcePaging extends BasePaging {

}