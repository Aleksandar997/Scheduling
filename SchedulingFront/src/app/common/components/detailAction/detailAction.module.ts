import { NgModule } from '@angular/core';
import { TranslatePipeModule } from 'src/app/common/pipes/translate/translatePipe.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/common/components/loader/loader.module';
import { ToasterModule } from 'src/app/common/components/toaster/toaster.module';
import { DataGridModule } from 'src/app/common/components/dataGrid/dataGrid.module';
import { ClearInputOnBackspaceModule } from 'src/app/common/directives/clearInputOnBackspace/clearInputOnBackspace.module';
import { MatIconModule, MatButtonModule, MatInputModule, MatTableModule, MatTooltipModule, MatPaginatorModule, MatSortModule, MatSelectModule } from '@angular/material';
import { DetailActionComponent } from './detailAction.component';


@NgModule({
  declarations: [
      DetailActionComponent
  ],
  imports: [
    TranslatePipeModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    LoaderModule,
    ToasterModule,
    MatInputModule,
    DataGridModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    ClearInputOnBackspaceModule
  ],
  providers: [],
  bootstrap: [],
  exports: [
    DetailActionComponent
  ]
})
export class DetailActionModule { }
