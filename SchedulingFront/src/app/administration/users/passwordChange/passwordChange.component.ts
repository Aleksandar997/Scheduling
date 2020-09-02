import { Component, OnInit, Injector, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/common/services/authentication.service';
import { FormBase } from 'src/app/common/base/formBase';
import { LocalData } from 'src/app/common/data/localData';
import { FormGroupHelper } from 'src/app/common/helpers/formGroupHelper';
import { LoaderComponent } from 'src/app/common/components/loader/loader.component';
import { PasswordModel } from 'src/app/common/models/user';
import { ResponseStatus } from 'src/app/common/models/responseBase';
import { ToasterService } from 'src/app/common/components/toaster/toaster.service';

@Component({
  templateUrl: './passwordChange.component.html',
  styleUrls: ['../../../../assets/css/accountManagement.css']
})
export class PasswordChangeComponent extends FormBase implements OnInit {
  @ViewChild('loader') loader: LoaderComponent;
  modalLoader: LoaderComponent;
  form = this.fb.group({
    userName: new FormControl(),
    email: new FormControl(),
    password: new FormControl(null, [Validators.required]),
    newPassword: new FormControl(null, [Validators.required]),
    newPasswordRepeat: new FormControl(null, [Validators.required]),
    isAdmin: new FormControl(false)
  });
  closed = new EventEmitter();
  returnUrl;
  loggedIn = false;
  isAdmin = false;
  constructor(private inj: Injector, private fb: FormBuilder, private authenticationService: AuthenticationService,
              private changeDetector: ChangeDetectorRef) {
    super(inj);
    this.returnUrl = LocalData.getReturnUrl() ? LocalData.getReturnUrl() : '/';
  }

  init(userName: string) {
    this.form.getControls('userName').setValue(userName);
    // this.form.getControls('email').setValue(email);
  }

  initModal(loader: LoaderComponent) {
    this.isAdmin = LocalData.isUserAdmin();
    this.form.getControls('isAdmin').setValue(this.isAdmin);
    if (this.isAdmin) {
      this.form.getControls('password').setValidators([]);
    }
    this.modalLoader = loader;
    this.loggedIn = true;
    this.changeDetector.detectChanges();
    this.form.getControls('userName').setValue(LocalData.getUser().userName);
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
      ToasterService.openWarning(this.getLocalization('form_not_valid'));
      return;
    }
    this.loaderShow();
    this.authenticationService.changePassword(this.form.getRawValue() as PasswordModel).then(res => {
      this.loaderHide();
      if (res.status === ResponseStatus.Error) {
        ToasterService.openError(res.messages.map(x => x.value));
        return;
      }
      ToasterService.openSuccess('password_changed');
      if (this.loggedIn) {
        this.cancel();
        return;
      }
      this.login();

    }).catch((error) => {
      this.loaderHide();
      this.form.addServerErrors(error.error);
      ToasterService.handleErrors(error, 'password_change_error');
    });
  }

  login() {
    this.authenticationService.login(this.form.getControls('userName').value, this.form.getControls('newPassword').value)
    .then(() => {
      this.loader.hide();
      this.cancel();
    }).catch(err => {
      this.loader.hide();
      ToasterService.openError(this.getLocalization('password_change_error'));
    });
  }

  cancel() {
    if (this.closed.observers && this.closed.observers.length > 0) {
      this.closed.emit();
    }
    this.router.navigate([this.returnUrl]);
  }
  
}
