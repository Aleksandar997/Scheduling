import { NgModule } from '@angular/core';
import { CodebookBaseModule } from '../common/components/codebookBase/codebookBase.module';
import { CustomersComponent } from './customers.component';
import { CustomersRoutingModule } from './customers-routing.module';


@NgModule({
  declarations: [
    CustomersComponent
  ],
  imports: [
    CustomersRoutingModule,
    CodebookBaseModule
  ],
  providers: [],
  bootstrap: []
})
export class CustomersModule { }
