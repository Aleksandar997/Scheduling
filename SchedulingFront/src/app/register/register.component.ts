import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormBase } from '../common/base/formBase';
import { MatProgressBar, MatVerticalStepper } from '@angular/material';
import { LoaderComponent } from '../common/components/loader/loader.component';
import { RegisterService } from '../services/register.service';
import { FileService } from '../common/services/file.service';
import { RegisterModel } from '../models/registerModel';
import { merge } from 'rxjs';
import { ToasterService } from '../common/components/toaster/toaster.service';
import { FileUploadComponent } from '../common/components/fileUpload/fileUpload.component';

@Component({
  templateUrl: './register.component.html',
  styleUrls: [
    './register.component.css',
    '../../assets/css/accountManagement.css'
  ]
})
export class RegisterComponent extends FormBase implements OnInit {
  @ViewChild(MatProgressBar) matProgressBar: MatProgressBar;
  @ViewChild(FileUploadComponent) fileUpload: FileUploadComponent;
  @ViewChild('stepper') stepper: MatVerticalStepper;
  @ViewChild('loader') loader: LoaderComponent;
  register = new FormGroup({
    license: this.fb.group({
      value: new FormControl(null, [Validators.required])
    }),
    user: new FormGroup({
      userName: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      passwordRepeat: new FormControl(null, [Validators.required]),
      image: new FormControl(),
      company: new FormGroup({
        name: new FormControl(null, [Validators.required]),
        logoPath: new FormControl(null, [Validators.required])
      })
    })
  });

  setPasswordType = (element) => element.type = element.type === 'text' ? 'password' : 'text';
  getVisibility = (element) => element.type === 'password' ? 'visibility_off' : 'visibility';
  reset() {
    this.register.reset();
    this.fileUpload.reset();
    this.stepper.reset();
  }

  constructor(private inj: Injector, private fb: FormBuilder, private registerService: RegisterService) {
    super(inj);
    merge(
      this.register.getControls('user.password').valueChanges,
      this.register.getControls('user.passwordRepeat').valueChanges
    ).subscribe(() => {
      const passRepeat = this.register.getControls('user.passwordRepeat');
      const pass = this.register.getControls('user.password');
      if (passRepeat.value !== pass.value) {
        passRepeat.setErrors({
          notMatch: 'passwords_dont_match'
        });
        pass.setErrors({
          notMatch: 'passwords_dont_match'
        });
      }
    });
  }

  ngOnInit() {

  }

  submit() {
    this.fileUpload.uploadFile((fileId: number) => {
      const register = this.register.getRawValue() as RegisterModel;
      register.user.company.fileId = fileId;
      return this.registerService.saveCompany(register);
    }, this.loader, this.register, '');
  }

  navigate() {
    this.router.navigate(['']);
  }
}
