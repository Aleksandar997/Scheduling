import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { TranslatePipe } from '../../pipes/translate/translatePipe';

@Component({
    selector: 'toaster',
    template: '',
    styleUrls: ['./toaster.component.css']
})
export class ToasterComponent {
    constructor(private snackBar: MatSnackBar, private translate: TranslatePipe) { }

    handleErrors(err: any, defaultError = 'label_error') {
        if (err && err.error && err.error.messages && err.error.messages.length > 0) {
            this.openError(err.error.messages.map(m => m.value));
            return;
        } else if (err && err.status === 403) {
            this.openError(this.translate.transform('label_forbidden'));
        } else {
            this.openError(this.translate.transform(defaultError));
        }
    }

    openSuccess(message: string | string[]) {
        this.openSnackbar(message, ToasterStatus.Success);
    }

    openError(message: string | string[]) {
        this.openSnackbar(message, ToasterStatus.Error);
    }

    openWarning(message: string | string[]) {
        this.openSnackbar(message, ToasterStatus.Warning);
    }

    private openSnackbar(message: string | string[], status: ToasterStatus) {
        if (message instanceof Array) {
            message.forEach(m => this.snackBar.open(m, null, this.getSnackbarConfig(status)));
            return;
        }
        this.snackBar.open(message, null, this.getSnackbarConfig(status));
    }

    private getSnackbarConfig(status: ToasterStatus): MatSnackBarConfig<any> {
        return {
            panelClass: this.getStatusCode(status),
            duration: 2.5 * 1000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
        };
    }

    private getStatusCode(status: ToasterStatus): string {
        let code = '';
        switch (status) {
            case ToasterStatus.Success:
                code = 'success';
                break;
            case ToasterStatus.Warning:
                code = 'warning';
                break;
            case ToasterStatus.Error:
                code = 'error';
                break;
        }
        return code;
    }
}

enum ToasterStatus {
    Success = 11, Error = 22, Warning = 5
}

// export class ToasterEventBase {
//     toasterStatus: ToasterStatus;
//     message: string;
//     err: any;

//     constructor(tasterStatus: ToasterStatus, err = null) {
//         this.toasterStatus = this.toasterStatus;
//         this.err = err;
//     }
// }

