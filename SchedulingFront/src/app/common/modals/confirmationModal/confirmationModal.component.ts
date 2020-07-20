import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModalBase } from 'src/app/common/models/modalBase';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  templateUrl: './confirmationModal.component.html',
  styleUrls: ['./confirmationModal.component.css']
})
export class ConfirmationModalComponent {
  @ViewChild('loader', { static: false }) loader: LoaderComponent;
  isConfirmed = false;
  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalBase) {
    if (this.data.eventEmitter) {
      this.data.eventEmitter.subscribe(res => {
        if (res) {
          this.loader.show();
          return;
        }
        this.loader.hide();
      });
    }
  }

  onDecline() {
    this.dialogRef.close();
  }

  onConfirm() {
    this.isConfirmed = true;
    this.data.onConfirm();
  }
}
