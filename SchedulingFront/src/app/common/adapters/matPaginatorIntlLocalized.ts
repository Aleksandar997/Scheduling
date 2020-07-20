import { MatPaginatorIntl } from '@angular/material';
import { TranslatePipe } from '../pipes/translate/translatePipe';
import { Injectable } from '@angular/core';

@Injectable()
export class MatPaginatorIntlLocalized extends MatPaginatorIntl {
    constructor(private translate: TranslatePipe) {
        super();
    }
    itemsPerPageLabel = this.translate.transform('label_items_per_page');
    nextPageLabel = this.translate.transform('label_next_page');
    previousPageLabel = this.translate.transform('label_previous_page');
    firstPageLabel = this.translate.transform('label_first_page');
    lastPageLabel = this.translate.transform('label_last_page');

    getRangeLabel = (page: number, pageSize: number, length: number) => {
        return ((page * pageSize) + 1) + ' - ' + ((page * pageSize) + pageSize) + ` ${this.translate.transform('label_of')} ` + length;
    }
}
