import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users-routing.module';
import { PasswordChangeComponent } from './passwordChange/passwordChange.component';
import { UsersComponent } from './users.component';
import { MatInputModule, MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule } from '@angular/material';
import { LoaderModule } from 'src/app/common/components/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipeModule } from 'src/app/common/pipes/translate/translatePipe.module';
import { ToasterModule } from 'src/app/common/components/toaster/toaster.module';

@NgModule({
  imports: [
    UsersRoutingModule,
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
    ReactiveFormsModule
  ],
  declarations: [PasswordChangeComponent, UsersComponent]
})
export class UsersModule { }