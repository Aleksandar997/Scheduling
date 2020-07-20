import { NgModule } from '@angular/core';
import { TranslatePipe } from './translatePipe';

@NgModule({
  exports: [TranslatePipe],
  declarations: [TranslatePipe],
  providers: [TranslatePipeModule]
})
export class TranslatePipeModule { }
