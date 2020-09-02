import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import {
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
} from '@angular/material';
import { LoaderModule } from '../common/components/loader/loader.module';
import { TranslatePipeModule } from '../common/pipes/translate/translatePipe.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../common/services/authentication.service';
import { LocalizationService } from '../common/services/localization.service';
import { ToasterModule } from '../common/components/toaster/toaster.module';
import { ForgottenPasswordComponent } from './forgottenPassword/forgottenPassword.component';
import { PasswordChangeComponent } from '../administration/users/passwordChange/passwordChange.component';
import { UsersModule } from '../administration/users/users.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    LoginComponent,
    ForgottenPasswordComponent
  ],
  exports: [
    LoginComponent
  ],
  imports: [
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    LoaderModule,
    FormsModule,
    CommonModule,
    TranslatePipeModule,
    ToasterModule,
    MatSelectModule,
    ReactiveFormsModule,
    UsersModule,
    RouterModule
  ],
  providers: [
    AuthenticationService,
    LocalizationService
  ],
  entryComponents: [
    PasswordChangeComponent
  ]
})
export class LoginModule { }
