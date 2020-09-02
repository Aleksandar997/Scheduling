import { Component, OnInit, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { LoaderComponent } from '../../components/loader/loader.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModalBase } from '../../models/modalBase';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ICrudServiceBase } from '../../models/iCrudServiceBase';
import { ToasterService } from '../../components/toaster/toaster.service';
import { FormGroupHelper } from '../../helpers/formGroupHelper';
import { CodebookColumn } from '../../models/codebookOutputModel';

@Component({
  templateUrl: './codebookEdit.component.html',
  styleUrls: ['./codebookEdit.component.css']
})
export class CodebookEditComponent implements OnInit, AfterViewInit {
  @ViewChild('loader') loader: LoaderComponent;
  form = new FormGroup({});
  columns = new Array<CodebookColumn>();
  type;
  isConfirmed = false;
  constructor(
    public dialogRef: MatDialogRef<CodebookEditComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ModalBase) {
    this.type = this.data.data.type;
    if (this.data.eventEmitter) {
      this.data.eventEmitter.subscribe(res => {
        if (res) {
          this.loader.show();
          return;
        }
        this.loader.hide();
      });
    }
    if (this.data.data.id === 0 || !this.data.data.id) {
      return;
    }
    this.data.data.service.getById(this.data.data.id).then(res => {
      FormGroupHelper.mapControlsToFormGroup(res.data.columns.map(x => x.name), res.data.data, this.form);
      this.columns = res.data.columns.map(x => {

        x.value = (x.name.split('.').map(n => n.firstCharToLower()) as Array<string>).join('.');
        x.label = x.name.split('.').pop().firstCharToLower();
        return x;
      }).filter(x => x.editable);
    }).catch(err => {
      this.loader.hide();
      ToasterService.handleErrors(err, 'codebook_get_error');
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // if (this.data.data.id === 0 || !this.data.data.id) {
    //   return;
    // }
    // this.loader.show();
    // this.data.data.service.getById(this.data.data.id).then(res => {
    //   this.loader.hide();
    //   this.columns = res.data.columns.map(x => {
    //     x.name = x.name.split('.').pop().firstCharToLower();
    //     return x;
    //   }).filter(x => x.editable);
    //   this.columns.forEach(c => this.form.addControl(c.name, new FormControl()));
    //   FormGroupHelper.mapObjectToFormGroup(res.data.data, this.form);
    //   console.log(this.form)
    // }).catch(() => {
    //   this.loader.hide();
    //   ToasterService.openError('global_error');
    // });
  }

  onDecline() {
    this.dialogRef.close();
  }

  onConfirm() {
    // this.data.onConfirm();
    this.loader.show();
    this.isConfirmed = true;
    // this.form.getControls('id').setValue(this.data.data.id);
    this.data.data.service.save(this.type(this.form.getRawValue())).then(res => {
      this.loader.hide();
      this.dialogRef.close();
      this.data.onConfirm();
    }).catch(() => {
      this.loader.hide();
      ToasterService.openError('global_save_error');
    });
  }
}

export class CodebookData<Tmodel, Tpaging> {
  id: number;
  service: ICrudServiceBase<Tmodel, Tpaging>;
  type;
  constructor(id: number, service: ICrudServiceBase<Tmodel, Tpaging>, type) {
    this.id = id;
    this.service = service;
    this.type = type;
  }
}
