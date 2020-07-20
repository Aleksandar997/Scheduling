import { Component, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalBase } from '../../models/modalBase';
import { ModalFactoryComponent, ModalFactoryModel } from './modalFactory/modalFactory.component';

@Component({
    template: ''
})
export class ModalBaseComponent {
    constructor(private matDialog: MatDialog) {
    }
    private dialogRef;
    onClose: EventEmitter<any> = new EventEmitter();
    output: EventEmitter<any> = new EventEmitter();
    openDialog(modalBase: ModalBase, type: any, panelClass: string = 'base-modal'): any | void {
        if (modalBase) {
            modalBase.output = this.output;
        }
        this.dialogRef = this.matDialog.open(type, {
            panelClass,
            data: modalBase,
        });
        this.dialogRef.afterClosed().subscribe(result => {
            this.onClose.emit(result);
        });
    }

    openComponent(data: ModalFactoryModel, panelClass: string = 'base-modal') {
        this.dialogRef = this.matDialog.open(ModalFactoryComponent, {
            panelClass,
            data,
        });
    }

    closeDialog(): any | void {
        this.matDialog.closeAll();
    }

}
