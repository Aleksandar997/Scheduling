import { ProductType } from './productType';
import { BasePaging } from '../common/models/basePaging';

export class Product {
    productId: number;
    code: string;
    name: string;
    image: string;
    active: boolean;
    productTypeid: number;
    productType: ProductType;
    price: number;
    organizationUnitId: number;
    productPricelist = new Array<ProductPricelist>();
    organizationUnits = new Array<number>();
}

export class ProductPricelist {
    organizationUnitId: number;
    organizationUnitName: string;
    documentDetailId: number;
    price: number;
    documentId: number;
    productId: number;
    constructor(organizationUnitId: number = null, organizationUnitName: string = null) {
        this.organizationUnitId = organizationUnitId;
        this.organizationUnitName = organizationUnitName;
        this.documentDetailId = null;
        this.price = null;
        this.documentId = null;
    }
}

export class ProductPaging extends BasePaging {
    name: string;
    code: string;
    productTypeId: number;
    organizationUnits = new Array<number>();
}
