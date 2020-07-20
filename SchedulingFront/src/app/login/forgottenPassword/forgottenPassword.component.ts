import { Component, OnInit, ViewChild, Injector, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToasterComponent } from 'src/app/common/components/toaster/toaster.component';
import { LoaderComponent } from 'src/app/common/components/loader/loader.component';
import { FormBase } from 'src/app/common/base/formBase';
import { FormGroupHelper } from 'src/app/common/helpers/formGroupHelper';
import { AuthenticationService } from 'src/app/common/services/authentication.service';
import { UserCredentials } from 'src/app/common/models/user';
import { ResponseStatus } from 'src/app/common/models/responseBase';
import { PasswordChangeComponent } from 'src/app/administration/users/passwordChange/passwordChange.component';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './forgottenPassword.component.html',
  styleUrls: ['../../../assets/css/accountManagement.css']
})
export class ForgottenPasswordComponent extends FormBase implements OnInit {
  @ViewChild('toaster', { static: false }) toaster: ToasterComponent;
  @ViewChild('loader', { static: false }) loader: LoaderComponent;
  @ViewChild('passChange', { static: false, read: ViewContainerRef }) passChange: ViewContainerRef;
  form = this.fb.group({
    userName: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email])
  });
  changePassSub: Subscription;
  constructor(private inj: Injector, private fb: FormBuilder, private authenticationService: AuthenticationService,
              private facResolver: ComponentFactoryResolver) {
    super(inj);
   }

  ngOnInit() {
  }

  onDecline() {
    this.router.navigate(['/login']);
  }

  onConfirm() {
    if (!FormGroupHelper.isValid(this.form)) {
      this.toaster.openWarning(this.getLocalization('form_not_valid'));
      return;
    }
    this.loader.show();
    this.authenticationService.forgottenPassword(this.form.getRawValue() as UserCredentials).then(res => {
      console.log(res)
      this.loader.hide();
      if (res.status === ResponseStatus.Error) {
        this.toaster.openError(res.messages.map(x => x.value));
        return;
      }
      this.toaster.openSuccess('email_sent');
      let compFactory: ComponentFactory<any>;
      compFactory = this.facResolver.resolveComponentFactory(PasswordChangeComponent);
      const comp = this.passChange.createComponent(compFactory);
      comp.instance.init(this.getControls(this.form, 'userName').value, this.getControls(this.form, 'email').value);
      this.changePassSub = comp.instance.closed.subscribe(() => this.hide());
      
    })
    // .catch(err => {
    //   console.log(err)
    //   this.loader.hide();
    //   this.addErrors(err.error, this.form);
    //   this.toaster.handleErrors(err, 'password_change_error');
    // });
  }

  hide() {
    this.changePassSub.unsubscribe();
    this.passChange.clear();
  }

}
