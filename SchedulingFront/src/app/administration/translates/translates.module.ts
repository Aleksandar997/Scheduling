import { NgModule } from '@angular/core';
import { TranslatesComponent } from './translates.component';
import { TranslatesRoutingModule } from './translates-routing.module';
import { RouterModule } from '@angular/router';
import { TranslatePipeModule } from 'src/app/common/pipes/translate/translatePipe.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatTooltipModule, MatInputModule, MatIconModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatSortModule, MatSelectModule } from '@angular/material';
import { PortalOutletDirectiveModule } from 'src/app/common/directives/portalOutlet/portalOutlet.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataGridModule } from 'src/app/common/components/dataGrid/dataGrid.module';
import { LoaderModule } from 'src/app/common/components/loader/loader.module';
import { ModalBaseModule } from 'src/app/common/modals/modalBase/modalBase.module';
import { ActionComponent } from './action/action.component';

@NgModule({
  declarations: [
    TranslatesComponent,
    ActionComponent
  ],
  imports: [
    TranslatesRoutingModule,
    RouterModule,
    TranslatePipeModule,
    PortalOutletDirectiveModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    DataGridModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    ModalBaseModule,
    MatSortModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: []
})
export class TranslatesModule { }
