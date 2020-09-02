import { NgModule } from '@angular/core';
import { CodebookBaseComponent } from './codebookBase.component';
import { TranslatePipeModule } from '../../pipes/translate/translatePipe.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatButtonModule, MatTableModule, MatTooltipModule, MatPaginatorModule, MatSortModule, MatCardModule, MatInputModule, MatDialogModule, MatFormFieldModule } from '@angular/material';
import { DataGridModule } from '../dataGrid/dataGrid.module';
import { ModalBaseModule } from '../../modals/modalBase/modalBase.module';
import { PortalOutletDirectiveModule } from '../../directives/portalOutlet/portalOutlet.module';
import { LoaderModule } from '../loader/loader.module';
import { RouterModule } from '@angular/router';
import { ToasterModule } from '../toaster/toaster.module';

@NgModule({
  declarations: [
    CodebookBaseComponent
  ],
  imports: [
    TranslatePipeModule,
    MatCardModule,
    PortalOutletDirectiveModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    DataGridModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    ModalBaseModule,
    MatTooltipModule,
    LoaderModule,
    RouterModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule
  ],
  bootstrap: [],
  exports: [
    CodebookBaseComponent
  ]
})
export class CodebookBaseModule { }
