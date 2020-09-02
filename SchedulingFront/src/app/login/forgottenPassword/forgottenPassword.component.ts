import { Component, OnInit, ViewChild, Injector, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoaderComponent } from 'src/app/common/components/loader/loader.component';
import { FormBase } from 'src/app/common/base/formBase';
import { FormGroupHelper } from 'src/app/common/helpers/formGroupHelper';
import { AuthenticationService } from 'src/app/common/services/authentication.service';
import { UserCredentials } from 'src/app/common/models/user';
import { ResponseStatus } from 'src/app/common/models/responseBase';
import { PasswordChangeComponent } from 'src/app/administration/users/passwordChange/passwordChange.component';
import { Subscription } from 'rxjs';
import { ToasterService } from 'src/app/common/components/toaster/toaster.service';

@Component({
  templateUrl: './forgottenPassword.component.html',
  styleUrls: ['../../../assets/css/accountManagement.css']
})
export class ForgottenPasswordComponent extends FormBase implements OnInit {
  @ViewChild('loader') loader: LoaderComponent;
  @ViewChild('passChange', { read: ViewContainerRef }) passChange: ViewContainerRef;
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
      ToasterService.openWarning(this.getLocalization('form_not_valid'));
      return;
    }
    this.loader.show();
    this.authenticationService.forgottenPassword(this.form.getRawValue() as UserCredentials).then(res => {
      this.loader.hide();
      if (res.status === ResponseStatus.Error) {
        ToasterService.openError(res.messages.map(x => x.value));
        return;
      }
      ToasterService.openSuccess('email_sent');
      let compFactory: ComponentFactory<any>;
      compFactory = this.facResolver.resolveComponentFactory(PasswordChangeComponent);
      const comp = this.passChange.createComponent(compFactory);
      comp.instance.init(this.form.getControls('userName').value);
      this.changePassSub = comp.instance.closed.subscribe(() => this.hide());
    }).catch(err => {
      this.loader.hide();
      this.form.addServerErrors(err.error);
      ToasterService.handleErrors(err, 'password_change_error');
    });
  }

  hide() {
    this.changePassSub.unsubscribe();
    this.passChange.clear();
  }

}
