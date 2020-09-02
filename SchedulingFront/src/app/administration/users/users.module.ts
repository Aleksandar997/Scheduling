import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users-routing.module';
import { PasswordChangeComponent } from './passwordChange/passwordChange.component';
import { UsersComponent } from './users.component';
import { MatInputModule, MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatTableModule, MatPaginatorModule, MatTooltipModule, MatDialogModule, MatCheckboxModule, MatSelectModule, MatSortModule } from '@angular/material';
import { LoaderModule } from 'src/app/common/components/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipeModule } from 'src/app/common/pipes/translate/translatePipe.module';
import { ToasterModule } from 'src/app/common/components/toaster/toaster.module';
import { RouterModule } from '@angular/router';
import { PortalOutletDirectiveModule } from 'src/app/common/directives/portalOutlet/portalOutlet.module';
import { DataGridModule } from 'src/app/common/components/dataGrid/dataGrid.module';
import { ModalBaseModule } from 'src/app/common/modals/modalBase/modalBase.module';
import { ActionComponent } from './action/action.component';

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
    ReactiveFormsModule,
    RouterModule,
    PortalOutletDirectiveModule,
    DataGridModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    ModalBaseModule,
    MatSortModule
  ],
  declarations: [PasswordChangeComponent, UsersComponent, ActionComponent]
})
export class UsersModule { }