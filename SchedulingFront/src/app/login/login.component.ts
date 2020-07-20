import { Component, ViewChild, ElementRef, Injector, AfterViewInit } from '@angular/core';
import { FormBase } from '../common/base/formBase';
import { ToasterComponent } from '../common/components/toaster/toaster.component';
import { LoaderComponent } from '../common/components/loader/loader.component';
import { LocalizationService } from '../common/services/localization.service';
import { AuthenticationService } from '../common/services/authentication.service';
import { LocalData } from '../common/data/localData';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Culture } from '../common/models/culture';
import { User } from '../common/models/user';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['../../assets/css/accountManagement.css']
})
export class LoginComponent extends FormBase implements AfterViewInit {

  @ViewChild('toaster', { static: false }) toaster: ToasterComponent;
  @ViewChild('loader', { static: false }) loader: LoaderComponent;
  @ViewChild('username', { static: false }) username: ElementRef;
  returnUrl: string;
  loginForm: FormGroup;
  cultures: Array<Culture>;
  logoImage = 'assets/img/logo/logo.png';
  constructor(private inj: Injector, private authService: AuthenticationService,
              private localizationService: LocalizationService, private fb: FormBuilder) {
    super(inj);
    this.returnUrl = this.activeRouter.snapshot.queryParams.returnUrl || '/';
    this.loginForm = this.fb.group({
      userName: new FormControl(null),
      password: new FormControl(null),
      culture: new FormControl(0)
    });
  }

  ngAfterViewInit() {
    this.getLocalizationData();
  }

  login() {
    this.loader.show(true);
    const user = this.loginForm.getRawValue() as User;
    this.authService.login(user.userName, user.password).then(res => {
      this.loader.hide();
      this.navigateOnLogin();
    }).catch(err => {
      this.loader.hide();
      this.toaster.openError(this.getLocalization('login_error'));
      throw err;
    });
  }

  navigateOnLogin() {
    this.router.navigate([this.returnUrl]);
  }

  getLocalizationData() {
    this.localizationService.getLocalizationData()
      .then(res => {
        this.cultures = res;
        const firstCulture: Culture = this.cultures.firstElement();
        this.loadSelectedCulture(firstCulture);
        setTimeout(() => {
          this.username.nativeElement.focus();
        }, 1);
      }).catch((error) => {
        this.toaster.openError(this.getLocalization('login_error'));
        throw error;
      });
  }

  loadSelectedCulture(culture: Culture) {
    LocalData.setCulture(culture.cultureId.toString());
    LocalData.setTranslations(culture.localizationPair);
  }

  forgottenPassword() {
    this.router.navigateByUrl('forgotpassword');
  }
}
