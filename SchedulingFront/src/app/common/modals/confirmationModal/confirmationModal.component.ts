import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatButton } from '@angular/material';
import { ModalBase } from 'src/app/common/models/modalBase';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  templateUrl: './confirmationModal.component.html',
  styleUrls: ['./confirmationModal.component.css']
})
export class ConfirmationModalComponent implements AfterViewInit {
  @ViewChild('loader') loader: LoaderComponent;
  @ViewChild('confirmButton') confirmButton: MatButton;
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

  ngAfterViewInit() {
    this.confirmButton.focus()
  }
  onDecline() {
    this.dialogRef.close();
  }

  onConfirm() {
    this.isConfirmed = true;
    this.data.onConfirm();
  }
}
