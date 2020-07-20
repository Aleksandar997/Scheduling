import { Component, OnInit, Injector, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/common/services/authentication.service';
import { FormBase } from 'src/app/common/base/formBase';
import { LocalData } from 'src/app/common/data/localData';
import { FormGroupHelper } from 'src/app/common/helpers/formGroupHelper';
import { ToasterComponent } from 'src/app/common/components/toaster/toaster.component';
import { LoaderComponent } from 'src/app/common/components/loader/loader.component';
import { PasswordModel } from 'src/app/common/models/user';
import { ResponseStatus } from 'src/app/common/models/responseBase';
import { MatDialogRef } from '@angular/material';

@Component({
  templateUrl: './passwordChange.component.html',
  styleUrls: ['../../../../assets/css/accountManagement.css']
})
export class PasswordChangeComponent extends FormBase implements OnInit {
  @ViewChild('toaster', { static: false }) toaster: ToasterComponent;
  @ViewChild('loader', { static: false }) loader: LoaderComponent;
  modalLoader: LoaderComponent;
  modalToaster: ToasterComponent;
  form = this.fb.group({
    userName: new FormControl(),
    email: new FormControl(),
    password: new FormControl(null, [Validators.required]),
    newPassword: new FormControl(null, [Validators.required]),
    newPasswordRepeat: new FormControl(null, [Validators.required])
  });
  closed = new EventEmitter();
  returnUrl;
  loggedIn = false;
  constructor(private inj: Injector, private fb: FormBuilder, private authenticationService: AuthenticationService,
              private changeDetector: ChangeDetectorRef) {
    super(inj);
    this.returnUrl = LocalData.getReturnUrl() ? LocalData.getReturnUrl() : '/';
  }

  init(userName: string, email: string) {
    this.getControls(this.form, 'userName').setValue(userName);
    this.getControls(this.form, 'email').setValue(email);
  }

  initLogged(loader: LoaderComponent, toaster: ToasterComponent) {
    this.modalLoader = loader;
    this.modalToaster = toaster;
    this.loggedIn = true;
    this.changeDetector.detectChanges();
    console.log(LocalData.getUser())
    this.getControls(this.form, 'userName').setValue(LocalData.getUser().userName);
  }

  ngOnInit() {
  }

  loaderShow() {
    if (this.loggedIn) {
      this.modalLoader.show();
    } else {
      this.loader.show();
    }

  }

  loaderHide() {
    if (this.loggedIn) {
      this.modalLoader.hide();
    } else {
      this.loader.hide();
    }
  }

  onConfirm() {
    if (!FormGroupHelper.isValid(this.form)) {
      this.toaster.openWarning(this.getLocalization('form_not_valid'));
      return;
    }
    this.loaderShow();
    this.authenticationService.changePassword(this.form.getRawValue() as PasswordModel).then(res => {
      this.loaderHide();
      if (res.status === ResponseStatus.Error) {
        if (this.loggedIn) {
          this.modalToaster.openError(res.messages.map(x => x.value));
        } else {
          this.toaster.openError(res.messages.map(x => x.value));
        }
        return;
      }
      if (this.loggedIn) {
        this.modalToaster.openSuccess('password_changed');
        this.cancel();
        return;
      }
      this.toaster.openSuccess('password_changed');
      this.login();

    }).catch((error) => {
      this.loaderHide();
      if (this.loggedIn) {
        this.modalToaster.handleErrors(error, 'password_change_error');
        return;
      }
      this.toaster.handleErrors(error, 'password_change_error');
    });
  }

  login() {
    this.authenticationService.login(this.getControls(this.form, 'userName').value, this.getControls(this.form, 'newPassword').value)
    .then(() => {
      this.loader.hide();
      this.cancel();
    })
    .catch(err => {
      this.loader.hide();
      this.toaster.openError(this.getLocalization('password_change_error'));
    });
  }

  cancel() {
    if (this.closed.observers && this.closed.observers.length > 0) {
      this.closed.emit();
    }
    this.router.navigate([this.returnUrl]);
  }
}
