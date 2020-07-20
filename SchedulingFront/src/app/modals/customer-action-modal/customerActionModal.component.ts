import { Component, OnInit, ViewChild, Inject, AfterViewInit, OnDestroy, Injector } from '@angular/core';
import { LoaderComponent } from 'src/app/common/components/loader/loader.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModalBase } from 'src/app/common/models/modalBase';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/models/customer';
import { Subscription } from 'rxjs';
import { FormGroupHelper } from 'src/app/common/helpers/formGroupHelper';
import { FormBase } from 'src/app/common/base/formBase';
import { ToasterComponent } from 'src/app/common/components/toaster/toaster.component';

@Component({
  templateUrl: './customerActionModal.component.html',
  styleUrls: ['./customerActionModal.component.css']
})
export class CustomerActionModalComponent extends FormBase implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('loader', { static: false }) loader: LoaderComponent;
  @ViewChild('toaster', { static: false }) toaster: ToasterComponent;
  isConfirmed = false;
  form: FormGroup = this.fb.group({
    customerId: new FormControl(null),
    firstName: new FormControl(),
    lastName: new FormControl(),
    phoneNumber: new FormControl()
  });
  customerSub: Subscription;
  constructor(private inj: Injector,
    public dialogRef: MatDialogRef<CustomerActionModalComponent>, private customerService: CustomerService,
    @Inject(MAT_DIALOG_DATA) public data: ModalBase, private fb: FormBuilder) {
    super(inj);
    if (this.data.eventEmitter) {
      this.data.eventEmitter.subscribe(res => {
        if (res) {
          this.loader.show();
          return;
        }
        this.loader.hide();
      });
    }

    this.customerSub = this.customerService.customers.subscribe(res => {
      FormGroupHelper.mapObjectToFormGroup(res.find(x => x.customerId === data.data), this.form);
      this.loader.hide();
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.data.data > 0) {
      this.loader.show();
      this.customerService.selectById(this.data.data);
    }
  }

  ngOnDestroy() {
    this.customerSub.unsubscribe();
  }

  onDecline() {
    this.dialogRef.close();
  }

  onConfirm() {
    this.isConfirmed = true;
    this.loader.show();
    this.customerService.save(this.form.getRawValue() as Customer).then(() => {
      this.loader.hide();
      this.dialogRef.close();
      this.data.onConfirm();
    }).catch(err => {
      this.loader.hide();
      this.addErrors(err.error, this.form);
      this.isConfirmed = false;
      this.toaster.openError('customer_save_error')
    });
  }

}
