import { BasePaging } from './basePaging';

export class CalendarPaging extends BasePaging {
    dateFrom: Date;
    dateTo: Date;

    constructor(dateFrom: Date = null, dateTo: Date = null) {
        super();
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
    }
}
