import { NgModule } from '@angular/core';
import { PortalOutletDirective, FiltersPortalOutletDirective } from './portalOutlet.directive';

@NgModule({
    declarations: [
      PortalOutletDirective,
      FiltersPortalOutletDirective
    ],
    exports: [
      PortalOutletDirective,
      FiltersPortalOutletDirective
    ],
  })
  export class PortalOutletDirectiveModule { }
