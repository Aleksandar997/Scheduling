import { NgModule } from '@angular/core';
import { PortalOutletDirective } from './portalOutlet.directive';

@NgModule({
    declarations: [
      PortalOutletDirective
    ],
    exports: [
      PortalOutletDirective
    ],
  })
  export class PortalOutletDirectiveModule { }
