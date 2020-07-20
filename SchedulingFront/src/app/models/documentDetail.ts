import { Product } from './product';

export class DocumentDetail {
    documentDetailId: number;
    documentId: number;
    productId: number;
    product: Product;
    quantity: number;
    discount: number;
    priceWithDiscount: number;
    price: number;

    constructor() {
        this.price = null;
    }
}
