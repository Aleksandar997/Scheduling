import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { PortalOutletDirectiveModule } from '../common/directives/portalOutlet/portalOutlet.module';
import { ChartsModule } from '../charts/Charts.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material';
import { TranslatePipeModule } from '../common/pipes/translate/translatePipe.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    HomeRoutingModule,
    PortalOutletDirectiveModule,
    ChartsModule,
    DragDropModule,
    MatCardModule,
    TranslatePipeModule
  ],
  providers: [],
  bootstrap: [],
  exports: [
  ]
})
export class HomeModule { }
