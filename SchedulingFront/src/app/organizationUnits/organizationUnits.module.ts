import { NgModule } from '@angular/core';
import { OrganizationUnitsComponent } from './organizationUnits.component';
import { OrganizationUnitsRoutingModule } from './organizationUnits-routing.module';
import { CodebookBaseModule } from '../common/components/codebookBase/codebookBase.module';


@NgModule({
  declarations: [
    OrganizationUnitsComponent
  ],
  imports: [
    OrganizationUnitsRoutingModule,
    CodebookBaseModule
  ],
  providers: [],
  bootstrap: []
})
export class OrganizationUnitsModule { }
