import { SortDirection } from '../helpers/sortDirection';

export class BasePaging {
    static pageSizeOptions = [20, 50, 100];
    sortBy: string;
    sortOrder: SortOrders;
    skip: number;
    take: number;
    onPageChange(size) {
        this.take = size.pageSize;
        this.skip = (size.pageSize * size.pageIndex);
    }

    onSortChange(sort) {
        this.sortBy = sort.active;
        this.sortOrder = SortDirection(sort.direction);
    }

    assign<T extends BasePaging>(paging: T) {
        Object.keys(paging).forEach(prop => {
            this[prop] = paging[prop];
        });
    }

    constructor() {
        this.sortBy = null;
        this.sortOrder = SortOrders.Asc;
        this.skip = 0;
        this.take = 20;
    }
}

export enum SortOrders {
    Asc = 1,
    Desc = 2
}
