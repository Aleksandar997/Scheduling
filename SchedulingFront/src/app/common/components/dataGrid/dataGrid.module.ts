import { NgModule } from '@angular/core';
import { DataGridComponent } from './dataGrid.component';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatSortModule, MatPaginatorModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
      CommonModule,
      MatTableModule,
      MatSortModule,
      ReactiveFormsModule,
      MatPaginatorModule
  ],
  declarations: [DataGridComponent],
  exports: [
    DataGridComponent
  ]
})
export class DataGridModule { }
