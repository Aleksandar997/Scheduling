import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { PortalOutletDirectiveModule } from '../common/directives/portalOutlet/portalOutlet.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    HomeRoutingModule,
    PortalOutletDirectiveModule
  ],
  providers: [],
  bootstrap: [],
  exports: [
  ]
})
export class HomeModule { }
