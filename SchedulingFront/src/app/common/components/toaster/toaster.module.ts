import { NgModule } from '@angular/core';
import { ToasterComponent } from './toaster.component';
import { MatSnackBarModule } from '@angular/material';

@NgModule({
  declarations: [
    ToasterComponent
  ],
  imports: [MatSnackBarModule],
  exports: [ToasterComponent]
})
export class ToasterModule { }
