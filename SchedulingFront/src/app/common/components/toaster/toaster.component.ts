import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslatePipe } from '../../pipes/translate/translatePipe';

@Component({
    selector: 'toaster',
    template: '',
    styleUrls: ['./toaster.component.css']
})
export class ToasterComponent {
    constructor(private snackBar: MatSnackBar, private translate: TranslatePipe) { }

    open(obj) {
        const isArray = obj.message instanceof Array;
        const message = isArray ? obj.message.shift() : obj.message;
        if (isArray && obj.message.length === 0) {
            return;
        }

        this.snackBar.open(this.translate.transform(message), null, obj.config).afterDismissed().toPromise().then(() => {
            if (!isArray) {
                return;
            }
            this.open(obj);
        });
    }
}
