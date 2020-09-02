import { NgModule } from '@angular/core';
import { ProgressLoaderComponent } from './progressLoader.component';
import { MatProgressBarModule } from '@angular/material';

@NgModule({
  declarations: [
    ProgressLoaderComponent
  ],
  imports: [
      MatProgressBarModule
  ],
  bootstrap: [],
  exports: [
    ProgressLoaderComponent
  ]
})
export class ProgressLoaderModule { }
