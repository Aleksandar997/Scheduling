import { NgModule } from '@angular/core';
import { CodebooksComponent } from './codebooks.component';
import { CodebookBaseModule } from '../common/components/codebookBase/codebookBase.module';
import { CodebooksRoutingModule } from './codebooks-routing.module';

@NgModule({
  declarations: [
    CodebooksComponent
  ],
  imports: [
    CodebookBaseModule,
    CodebooksRoutingModule
  ],
  bootstrap: [],
  exports: [
  ]
})
export class CodebooksModule { }
