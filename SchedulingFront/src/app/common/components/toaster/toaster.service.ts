import { Subject, BehaviorSubject } from 'rxjs';
import { MatSnackBarConfig } from '@angular/material';
import { StorageHelper } from '../../helpers/storageHelper';

export class ToasterService {
    private static _toaster = new Subject<any>();
    static toaster = ToasterService._toaster.asObservable();

    static notificationData = new Array<Notification>();
    static _notifications = new BehaviorSubject<Array<Notification>>([]);
    static notifications = ToasterService._notifications.asObservable();
    static newNotificationNumber = 0;
    static handleErrors(err: any, defaultError = 'label_error') {
        if (err && err.error && err.error.messages && err.error.messages.length > 0) {
            this.openError(err.error.messages.map(m => m.value));
            return;
        } else if (err && err.status === 403) {
            this.openError('label_forbidden');
        } else {
            this.openError(defaultError);
        }
    }

    static initCacheNotificationData() {
        const data = StorageHelper.getData('notifications');
        ToasterService.notificationData = data ? data : new Array<Notification>();
        this._notifications.next(ToasterService.notificationData);
    }

    static clearCache() {
        StorageHelper.deleteData('notifications');
        ToasterService.notificationData = new Array<Notification>();
        ToasterService._notifications.next(null);
    }

    static openSuccess(message: string | string[]) {
        this.openSnackbar(message, ToasterStatus.Success);
    }

    static openNotify(message: string | string[], urlPath: string = null) {
        this.newNotificationNumber += 1;
        this.openSnackbar(message, ToasterStatus.Notify, urlPath);
    }

    static openError(message: string | string[]) {
        this.openSnackbar(message, ToasterStatus.Error);
    }

    static openWarning(message: string | string[]) {
        this.openSnackbar(message, ToasterStatus.Warning);
    }

    private static openSnackbar(message: string | string[], status: ToasterStatus, urlPath: string = null) {
        if (message instanceof Array) {
            message.forEach(x => this.notificationData.unshift(new Notification(status, x, urlPath)));
        } else {
            this.notificationData.unshift(new Notification(status, message, urlPath));
        }
        this._notifications.next(this.notificationData);
        StorageHelper.setData('notifications', ToasterService.notificationData);
        this._toaster.next({ message, action: null, config: this.getSnackbarConfig(status) });
    }

    private static getSnackbarConfig(status: ToasterStatus): MatSnackBarConfig<any> {
        return {
            panelClass: this.getStatusCode(status),
            duration: 1.5 * 1000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
        };
    }

    static getStatusCode(status: ToasterStatus): string {
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
            case ToasterStatus.Notify:
                code = 'notify';
                break;
        }
        return code;
    }

    static getNotificationIcon(status: ToasterStatus) {
        let statusIcon;
        switch (status) {
          case ToasterStatus.Success:
            statusIcon = 'check_circle_outline';
            break;
          case ToasterStatus.Error:
            statusIcon = 'highlight_off';
            break;
          default:
            statusIcon = 'error_outline';
        }
        return statusIcon;
      }
}

export enum ToasterStatus {
    Success = 11, Error = 22, Warning = 5, Notify = 6
}

export class Notification {
    status: ToasterStatus;
    message: string;
    time: Date;
    urlPath: string;
    constructor(status: ToasterStatus, message: string, urlPath: string) {
        this.status = status;
        this.message = message;
        this.time = new Date();
        this.urlPath = urlPath;
    }
}
